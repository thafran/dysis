/* eslint-disable require-jsdoc */

import log from '../../helpers/log.js';
import {query} from 'express-validator';
import {differenceInDays} from 'date-fns';
import {Request, Response} from 'express';

import {
  respondWithSuccessAndData,
  respondWithErrorNotFound,
  respondWithNoContent,
} from '../../helpers/response.js';
import {
  getSubmissionsFromRedditUserOnPushshift,
  getCommentsFromRedditUserOnPushshift,
} from '../../sources/reddit/pushshift.js';
import validate from '../../helpers/validate.js';
import redditModel from './redditModel.js';
import {getCountOfSubreddits} from '../../helpers/utils.js'
import {PushshiftRedditPost} from '../../sources/reddit/pushshift.d.js';
import {ToxicityContext} from '../../analytics/ToxicityContext.js';

const VALIDITY_PERIOD = 14;
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

  static highest = [
    query('behavior')
      .exists().withMessage('Value is required')
      .isString().withMessage('Value needs to be string'),
    validate,
    async(req: Request, res: Response) => {
      const selectedBehavior = `${req.query.behavior}`
      let highest = {};
      try {
        switch(selectedBehavior) {
          case('toxicity'): {
            highest = await redditModel.find({}).sort({"analytics.perspective.toxicity": -1}).limit(100);
            break;
          } case('severeToxicity'): {
            highest = await redditModel.find({}).sort({"analytics.perspective.severeToxicity": -1}).limit(100);
            break;
          } case('insult'): {
            highest = await redditModel.find({}).sort({"analytics.perspective.insult": -1}).limit(100);
            break;
          } case('threat'): {
            highest = await redditModel.find({}).sort({"analytics.perspective.threat": -1}).limit(100);
            break;
          } case('profanity'): {
            highest = await redditModel.find({}).sort({"analytics.perspective.profanity": -1}).limit(100);
            break;
          } case('identityAttack'): {
            highest = await redditModel.find({}).sort({"analytics.perspective.identityAttack": -1}).limit(100);
            break;
          }
        }
        respondWithSuccessAndData(res, highest, `Reddit data sorted by highest ${req.query.behavior}`)
      } catch(error) {
        console.log(error)
      }
    }
  ]

  static average = [
    query('behavior')
      .exists().withMessage('Value is required')
      .isString().withMessage('Value needs to be string'),
    validate,
    async(req: Request, res: Response) => {
      const selectedBehavior = `$analytics.perspective.${req.query.behavior}`
      const label = req.query.behavior
      try {
        const average = await redditModel.aggregate([
          { $group : { _id : null, label : { $avg : selectedBehavior } } }
        ]);
        respondWithSuccessAndData(res, average, `Reddit average of ${req.query.behavior}`)
      } catch(error) {
        console.log(error)
      }
    }
  ]

  static all = [
    async(req: Request, res: Response) => {
      try {
        const all = await redditModel.find({});
        respondWithSuccessAndData(res, all, `Reddit all data`)
      } catch(error) {
        console.log(error)
      }
    }
  ]

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
            log.info(`ANALYSIS`, `Updating (${identifier})`);
            try {
              const data = await analyze(identifier);
              await redditData.updateOne({identifier}, data);
              respondWithSuccessAndData(
                res,
                await redditData,
                'Updated analysis for an existing Reddit user',
              );
            } catch (error: any) {
              log.error(`ANALYSIS`, error.toString());
              respondWithNoContent(res, 'Analysis APIs overloaded')
            }
          } else {
            // Keep entry
            log.info(`ANALYSIS`, `Keeping (${identifier})`);
            respondWithSuccessAndData(
                res,
                redditData,
                'Kept analysis for an existing Reddit user',
            );
            return;
          }
        } else {
          // Entry does not exist
          log.info(`ANALYSIS`, `Creating (${identifier})`);
          try {
            const data = await analyze(identifier);
            redditData = await redditModel.create(data);
            respondWithSuccessAndData(
              res,
              await redditData,
              'Created analysis for a new Reddit user',
            );
          } catch (error: any) {
            log.error(`ANALYSIS`, error.toString() + ` (${identifier})`);
            respondWithNoContent(res, 'Analysis APIs overloaded')
          }
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
      subreddits?: {subreddit: string; count: number}[],
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

  log.info(`ANALYSIS`, `Analyzing information (${identifier})`);

  const submissionsResponse = await getSubmissionsFromRedditUserOnPushshift(
      identifier,
  );
  const submissions = submissionsResponse.data;

  const commentsResponse = await getCommentsFromRedditUserOnPushshift(
      identifier,
  );
  const comments = commentsResponse.data;

  const textSnippets = getTextSnippetsOfRedditPosts(submissions.data, comments.data)
      .slice(0, 30).join('; ');

  if (textSnippets !== '') {
    const perspective = await ToxicityContext.analyze(textSnippets);
    log.info(`ANALYSIS`, `Toxicity (${identifier})`)
    console.log(perspective);
    redditModel.analytics.perspective.toxicity = perspective.toxicity;
    redditModel.analytics.perspective.severeToxicity = perspective.severeToxicity;
    redditModel.analytics.perspective.threat = perspective.threat;
    redditModel.analytics.perspective.identityAttack = perspective.identityAttack;
    redditModel.analytics.perspective.insult = perspective.insult;
    redditModel.analytics.perspective.profanity = perspective.profanity;
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
  redditModel.metrics.totalComments = commentSubreddits.length;
  redditModel.metrics.totalSubmissions = submissionSubreddits.length;

  redditModel.context.subredditsForComments = getCountOfSubreddits(
      commentSubreddits
  );
  redditModel.context.subredditsForSubmissions = getCountOfSubreddits(
      submissionSubreddits
  );

  let mergedSubreddits: string[] = [];
  mergedSubreddits = mergedSubreddits.concat(submissionSubreddits, commentSubreddits)
  redditModel.context.subreddits = getCountOfSubreddits(
      mergedSubreddits
  )

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
