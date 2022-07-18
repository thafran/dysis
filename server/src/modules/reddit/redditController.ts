/* eslint-disable require-jsdoc */

import log from '../../helpers/log.js';
import {body, query} from 'express-validator';
import {differenceInDays} from 'date-fns';
import {Request, Response, NextFunction} from 'express';
import {MongoError} from 'mongodb';
import sanitizeHtml from 'sanitize-html';

import {
  respondWithSuccessAndData,
  respondWithErrorNotFound,
  respondWithError,
} from '../../helpers/response.js';
import {
  getSubmissionsFromRedditUserOnPushshift,
  getCommentsFromRedditUserOnPushshift,
} from '../../sources/reddit/pushshift.js';
import {getRandomInt} from '../../helpers/utils.js';
import validate from '../../helpers/validate.js';
import redditModel from './redditModel.js';
import {getByteSize} from '../../helpers/utils.js';
import {perspectiveAnalysis} from '../../analytics/toxicity/archive/perspective.js';
import {tensorflowToxicity} from '../../analytics/toxicity/tensorflowToxicity.js';
import {getCountOfSubreddits} from '../../helpers/utils.js'
import {PushshiftRedditPost} from '../../sources/reddit/pushshift.d.js';
import {ToxicityContext} from '../../analytics/ToxicityContext.js';

const VALIDITY_PERIOD = 90;
const VALIDITY_DEBUG = false;

/**
 * Controller class managing incoming requests to the respective model
 * each controller function is actually an array of functions to be plugged into
 * the router with validations by express-validator before as well as
 * the validate helper to check for detected validation errors
 * @param req
 * @param res
 * @param next
 */
export default class RedditController {
  /**
   * Takes multiple identifiers in a post body and sends array of results
   * (array can be empty if no results are found)
   * Creates an reddit object
   * @param res response instance
   * @param res response instance
   */
  static get = [
    // Validations using express-validator
    body('identifiers')
        .exists().withMessage('identifiers in request body required')
        .isArray().withMessage('identifiers must be an array'),
    body('identifiers.*')
        .isString().withMessage('identifier must be of type string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: Request, res: Response) => {
      const identifiers = req.body.identifiers;
      const data = await redditModel.find({identifier: identifiers});
      if (data !== null) {
        respondWithSuccessAndData(
            res,
            data,
        );
      } else {
        respondWithErrorNotFound(res);
      }
    },
  ];

  /**
   * Gets one reddit instance
   * @param res response instance
   * @param res response instance
   */
  static getOne = [
    // Validations using express-validator
    query('identifier')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: Request, res: Response) => {
      const identifier = req.query.identifier;
      const data = await redditModel
          .findOne({identifier: identifier}).exec();
      if (data !== null) {
        respondWithSuccessAndData(
            res,
            data,
        );
      } else {
        respondWithSuccessAndData(
            res,
            data,
            'No information for given identifier',
        );
      }
    },
  ];

  /**
   * Creates an reddit object
   * @param req request instance
   * @param res response instance
   */
  static createOne = [
    body('identifier')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be string'),
    validate,
    async (req: Request, res: Response) => {
      const identifier = req.body.identifier;
      try {
        const data = await redditModel.create(
            {
              identifier,
              liwcAnalytical: getRandomInt(99),
              liwcEmotionalTone: getRandomInt(99),
            },
        );
        respondWithSuccessAndData(
            res,
            data,
            'Created new element',
        );
      } catch (err) {
        if (err instanceof MongoError && err.code === 11000) {
          respondWithError(res, 'Identifier already exists');
        } else if (err instanceof Error) {
          log.error('DATABASE ERROR', err.toString());
          respondWithError(res)
        } else {
          console.log(err)
        }
      }
    },
  ];

  static analyze = [
    query('identifier')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be string'),
    validate,
    async (req: Request, res: Response) => {
      const identifier = req.query.identifier as string;
      try {
        let redditData = await redditModel.findOne({identifier});
        if (redditData !== null) {
          // Entry exists
          const lastTimeUpdated = new Date(redditData.updatedAt);
          const daysSinceLastUpdate = differenceInDays(
              Date.now(),
              lastTimeUpdated);
          if (daysSinceLastUpdate > VALIDITY_PERIOD || VALIDITY_DEBUG) {
            // Update entry
            log.info('ANALYSIS', 'Updating');
            const data = await analyze(identifier);
            await redditData.updateOne({identifier}, data);
            respondWithSuccessAndData(
                res,
                await redditData,
                'Updated analysis for an existing Reddit user',
            );
            return;
          } else {
            // Keep entry
            log.info('ANALYSIS', 'Keeping');
            respondWithSuccessAndData(
                res,
                redditData,
                'Kept analysis for an existing Reddit user',
            );
            return;
          }
        } else {
          // Entry does not exist
          log.info('ANALYSIS', 'Creating');
          const data = await analyze(identifier);
          redditData = await redditModel.create(data);
          respondWithSuccessAndData(
              res,
              await redditData,
              'Created analysis for a new Reddit user',
          );
        }
      } catch (error) {
        log.error('ERROR', 'Error for identifier: ' + req.query.identifier);
        respondWithErrorNotFound(res, `Error for identifier: ${req.query.identifier}`);
        console.log(error);
      }
    },
  ];
}

async function analyze(identifier: string) {
  type redditModelInterface = {
    identifier: string,
    metrics: {
      totalSubmissions?: number
      totalComments?: number,
      medianScoreComments?: number,
      medianScoreSubmissions?: number,
      averageScoreComments?: number,
      averageScoreSubmissions?: number,
    },
    context: {
      subredditsForComments?: {subreddit: string; count: number}[],
      subredditsForSubmissions?: {subreddit: string; count: number}[],
    },
    analytics: {
      perspective: {
        toxicity?: number,
        severeToxicity?: number,
        threat?: number,
        identityAttack?: number,
        profanity?: number,
        insult?: number,
      },
    },
  };

  const redditModel: redditModelInterface = {
    identifier,
    metrics: {},
    context: {},
    analytics: {
      perspective: {}
    },
  }

  log.info('ANALYSIS', `Analyzing information for ${identifier}`);

  const submissionsResponse = await getSubmissionsFromRedditUserOnPushshift(
      identifier,
  );
  const submissions = submissionsResponse.data;

  const commentsResponse = await getCommentsFromRedditUserOnPushshift(
      identifier,
  );
  const comments = commentsResponse.data;

  // console.log(submissions.data)
  // console.log(comments.data)

  const textSnippets = getTextSnippetsOfRedditPosts(submissions.data, comments.data)
      .slice(0, 30).join('; ');

  if (textSnippets !== '') {
    // const perspective = await perspectiveAnalysis(textSnippets);
    const perspective = await ToxicityContext.analyze(textSnippets);
    console.log(perspective);
    redditModel.analytics.perspective.toxicity = perspective.toxicity;
    redditModel.analytics.perspective.severeToxicity = perspective.severeToxicity;
    redditModel.analytics.perspective.threat = perspective.threat;
    redditModel.analytics.perspective.identityAttack = perspective.identityAttack;
    redditModel.analytics.perspective.insult = perspective.insult;
  }

  redditModel.metrics.totalSubmissions = submissions.data.length;
  redditModel.metrics.totalComments = comments.data.length;

  const commentScores: number[] = [];
  const commentSubreddits: string[] = [];

  const submissionScores: number[] = [];
  const submissionSubreddits: string[] = [];

  for (const comment of comments.data) {
    commentScores.push(comment.score);
    commentSubreddits.push(comment.subreddit);
  }

  for (const submission of submissions.data) {
    submissionScores.push(submission.score);
    submissionSubreddits.push(submission.subreddit);
  }

  redditModel.metrics.medianScoreComments = getMedianOfNumberArray(
      commentScores,
  );
  redditModel.metrics.medianScoreSubmissions = getMedianOfNumberArray(
      submissionScores,
  );

  redditModel.metrics.averageScoreComments = getAverageOfNumberArray(
      commentScores,
  );
  redditModel.metrics.averageScoreSubmissions = getAverageOfNumberArray(
      submissionScores,
  );

  redditModel.context.subredditsForComments = getCountOfSubreddits(
      commentSubreddits
  );
  redditModel.context.subredditsForSubmissions = getCountOfSubreddits(
      submissionSubreddits
  );

  return redditModel;
}

function getAverageOfNumberArray(numberArray: number[]): number {
  if (numberArray.length === 0) {
    return 0;
  }
  let sum = 0;
  for (const element of numberArray) {
    sum += element;
  }
  return sum / numberArray.length;
}

function getMedianOfNumberArray(numberArray: number[]) {
  numberArray = numberArray.sort();
  let result: number;
  const mid = Math.floor(numberArray.length / 2);
  result = numberArray[mid];
  if (numberArray.length % 2 === 0) {
    result = (numberArray[mid - 1] + numberArray[mid]) / 2;
  }
  if (isNaN(result)) {
    return 0;
  }
  return result;
}

/**
 * Returns an array of strings originating of the sorted submission and comments
 * @param submissions pushshift submission object
 * @param comments pushshift comment object
 * @returns each string is one text snippet
 */
function getTextSnippetsOfRedditPosts(submissions: PushshiftRedditPost[], comments: PushshiftRedditPost[]) {
  let posts: PushshiftRedditPost[] = [];
  posts = posts.concat(submissions, comments);
  posts = sortRedditPostsByCreatedUTC(posts);
  const textSnippets: string[] = [];
  for (const post of posts) {
    if (post.selftext !== undefined && post.selftext !== '' && post.selftext !== '[removed]') {
      const text = beautifyRedditText(post.selftext);
      if (text !== '') textSnippets.push(text);
    } else if (post.body !== undefined && post.body !== '' && post.body !== '[removed]') {
      const text = beautifyRedditText(post.body)
      if (text !== '') textSnippets.push(text);
    }
  }
  return textSnippets;
}

// TODO: Probably time consuming, check for efficiency
function sortRedditPostsByCreatedUTC(arrayOfRedditPosts: PushshiftRedditPost[]) {
  return arrayOfRedditPosts.sort((a: PushshiftRedditPost, b: PushshiftRedditPost) => b.created_utc - a.created_utc);
}

/**
 * Cleans up reddit text from text that would be difficult to interprete by an analytics tool
 * @param text 
 * @returns
 */
function beautifyRedditText(text: string) {
 return text
  // Remove quotes (indicated through '> Lorem ipsum')
    .replace(/^(>.+)$/g, '')
  // Remove links (indicated through '[text](url)')
    .replace(/(\[.+\]\(.+\))/g, '')
    .replace(/(\(http\S+\))/g, '')
    .replace(/(\(www\S+\))/g, '')
  // Remove line breaks, tabs and similar
    .replace(/[\n\r\t\s]+/g, ' ');
}
