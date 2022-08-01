import { query } from 'express-validator';
import { differenceInHours } from 'date-fns';
import { Request, Response } from 'express';

import {
  respondWithSuccessAndData,
  respondWithNoContent,
  respondWithError,
} from '../../helpers/response.js';
import validate from '../../helpers/validate.js';
import RedditModel from './RedditModel.js';
import { getCountOfSubreddits } from '../../helpers/utils.js';
import PerspectiveContext from '../../analytics/perspective/PerspectiveContext.js';
import log from '../../helpers/log.js';
import PushshiftRedditPost from '../../sources/reddit/PushshiftInterface.js';
import Pushshift from '../../sources/reddit/Pushshift.js';

export default class RedditController {
  static VALIDITY_PERIOD_ANALYSIS_IN_HOURS = 24 * 14;

  static VALIDITY_ANALYSIS_DEBUG = false;

  static VALIDITY_PERIOD_DETAILED_ANALYSIS_IN_HOURS = 24 * 14;

  static VALIDITY_DETAILED_ANALYSIS_DEBUG = false;

  static analyze = [
    query('identifier')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be string'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const identifier = req.query.identifier as string;
        let redditData = await RedditModel.findOne({ identifier });
        if (redditData !== null) {
          // Entry exists
          const lastTimeUpdated = redditData.updatedAt;
          const hoursSinceLastUpdate = differenceInHours(
            Date.now(),
            lastTimeUpdated,
          );
          if (hoursSinceLastUpdate > this.VALIDITY_PERIOD_ANALYSIS_IN_HOURS
            || this.VALIDITY_ANALYSIS_DEBUG) {
            // Update entry
            log.info('ANALYSIS', `Updating (${identifier})`);
            try {
              const data = await this.analyzeFunctionality(identifier);
              redditData.analytics = data.analytics;
              redditData.metrics = data.metrics;
              await redditData.save();
              respondWithSuccessAndData(
                res,
                redditData,
                'Updated analysis for an existing Reddit user',
              );
            } catch (error: any) {
              log.error('ANALYSIS', `Error for ${identifier}`);
              console.log(error);
              respondWithNoContent(res, 'Analysis APIs overloaded');
            }
          } else {
            // Keep entry
            log.info('ANALYSIS', `Keeping (${identifier})`);
            respondWithSuccessAndData(
              res,
              redditData,
              'Kept analysis for an existing Reddit user',
            );
            return;
          }
        } else {
          // Entry does not exist
          log.info('ANALYSIS', `Creating (${identifier})`);
          try {
            const data = await this.analyzeFunctionality(identifier);
            redditData = await RedditModel.create(data);
            respondWithSuccessAndData(
              res,
              await redditData,
              'Created analysis for a new Reddit user',
            );
          } catch (error: any) {
            log.error('ANALYSIS', `Error for (${identifier})`);
            console.log(error);
            respondWithNoContent(res, 'Analysis APIs overloaded');
          }
        }
      } catch (error) {
        log.error('ERROR', `Error for identifier: ${req.query.identifier}`);
        console.log(error);
        respondWithError(res, `Error for identifier: ${req.query.identifier}`);
      }
    },
  ];

  static analyzeDetailed = [
    query('identifier')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be string'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const identifier = req.query.identifier as string;
        let redditData = await RedditModel.findOne({ identifier });
        // Entry exists
        if (redditData !== null) {
          const lastTimeUpdated = redditData.analytics.perspectiveExamples.examplesUpdatedAt;
          const hoursSinceLastUpdate = differenceInHours(
            Date.now(),
            lastTimeUpdated,
          );
          // Update examples
          if (
            redditData.analytics.perspectiveExamples.examplesUpdatedAt === null
            || hoursSinceLastUpdate > this.VALIDITY_PERIOD_DETAILED_ANALYSIS_IN_HOURS
            || this.VALIDITY_DETAILED_ANALYSIS_DEBUG
          ) {
            log.info('DETAILED ANALYSIS', `Updating (${identifier})`);
            try {
              const analysis = await this.analyzeDetailedFunctionality(identifier);
              redditData.analytics.perspectiveExamples = analysis;
              console.log(redditData);
              await redditData.save();
              respondWithSuccessAndData(
                res,
                redditData.analytics.perspectiveExamples,
              );
            } catch (error) {
              console.log(error);
              respondWithError(
                res,
                `Could not get detailed analysis for ${identifier}`,
              );
            }
          // Keep examples
          } else {
            log.info('DETAILED ANALYSIS', `Keeping (${identifier})`);
            respondWithSuccessAndData(
              res,
              redditData.analytics.perspectiveExamples,
            );
          }
        // Entry does not exist
        } else {
          const data = await this.analyzeFunctionality(identifier);
          redditData = await RedditModel.create(data);
          const analysis = await this.analyzeDetailedFunctionality(identifier);
          redditData.analytics.perspectiveExamples = analysis;
          redditData = await redditData.save();
          respondWithSuccessAndData(
            res,
            redditData,
          );
        }
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];

  static highest = [
    query('behavior')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be string'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const selectedBehavior = `${req.query.behavior}`;
        let highest = {};
        switch (selectedBehavior) {
          case ('toxicity'): {
            highest = await RedditModel.find({})
              .sort({ 'analytics.perspective.toxicity': -1 })
              .select(['identifier', 'analytics', 'metrics', 'createdAt', 'updatedAt'])
              .limit(100);
            break;
          } case ('severeToxicity'): {
            highest = await RedditModel.find({})
              .sort({ 'analytics.perspective.severeToxicity': -1 })
              .select(['identifier', 'analytics', 'metrics', 'createdAt', 'updatedAt'])
              .limit(100);
            break;
          } case ('insult'): {
            highest = await RedditModel.find({})
              .sort({ 'analytics.perspective.insult': -1 })
              .select(['identifier', 'analytics', 'metrics', 'createdAt', 'updatedAt'])
              .limit(100);
            break;
          } case ('threat'): {
            highest = await RedditModel.find({})
              .sort({ 'analytics.perspective.threat': -1 })
              .select(['identifier', 'analytics', 'metrics', 'createdAt', 'updatedAt'])
              .limit(100);
            break;
          } case ('profanity'): {
            highest = await RedditModel.find({})
              .sort({ 'analytics.perspective.profanity': -1 })
              .select(['identifier', 'analytics', 'metrics', 'createdAt', 'updatedAt'])
              .limit(100);
            break;
          } case ('identityAttack'): {
            highest = await RedditModel.find({})
              .sort({ 'analytics.perspective.identityAttack': -1 })
              .select(['identifier', 'analytics', 'metrics', 'createdAt', 'updatedAt'])
              .limit(100);
            break;
          } default: {
            break;
          }
        }
        respondWithSuccessAndData(
          res,
          highest,
          `Reddit data sorted by highest ${req.query.behavior}`,
        );
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];

  static average = [
    query('behavior')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be string'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const selectedBehavior = `$analytics.perspective.${req.query.behavior}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const label = req.query.behavior;
        const average = await RedditModel.aggregate([
          { $group: { _id: null, label: { $avg: selectedBehavior } } },
        ]);
        respondWithSuccessAndData(
          res,
          average,
          `Reddit average of ${req.query.behavior}`,
        );
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];

  static all = [
    async (_: Request, res: Response) => {
      try {
        const all = await RedditModel.find({});
        respondWithSuccessAndData(
          res,
          all,
          'Reddit all data',
        );
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];

  static async analyzeFunctionality(identifier: string) {
    type RedditModelInterface = {
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
        subredditsForComments?: { subreddit: string; count: number }[],
        subredditsForSubmissions?: { subreddit: string; count: number }[],
        subreddits?: { subreddit: string; count: number }[],
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

    const redditDataModel: RedditModelInterface = {
      identifier,
      metrics: {},
      context: {},
      analytics: {
        perspective: {},
      },
    };

    log.info('ANALYSIS', `Analyzing information (${identifier})`);

    const submissionsResponse = await Pushshift.getSubmissionsFromRedditUserOnPushshift(
      identifier,
    );
    const submissions = submissionsResponse.data;

    const commentsResponse = await Pushshift.getCommentsFromRedditUserOnPushshift(
      identifier,
    );
    const comments = commentsResponse.data;

    const textSnippets = this.getTextSnippetsOfRedditPosts(submissions.data, comments.data)
      .slice(0, 30).join('; ');

    if (textSnippets !== '') {
      const perspective = await PerspectiveContext.analyze(textSnippets);
      log.info('ANALYSIS', `Toxicity (${identifier})`);
      console.log(perspective);
      redditDataModel.analytics.perspective.toxicity = perspective.toxicity;
      redditDataModel.analytics.perspective.severeToxicity = perspective.severeToxicity;
      redditDataModel.analytics.perspective.threat = perspective.threat;
      redditDataModel.analytics.perspective.identityAttack = perspective.identityAttack;
      redditDataModel.analytics.perspective.insult = perspective.insult;
      redditDataModel.analytics.perspective.profanity = perspective.profanity;
    }

    redditDataModel.metrics.totalSubmissions = submissions.data.length;
    redditDataModel.metrics.totalComments = comments.data.length;

    const commentScores: number[] = [];
    const commentSubreddits: string[] = [];

    const submissionScores: number[] = [];
    const submissionSubreddits: string[] = [];

    comments.data.forEach((comment) => {
      commentScores.push(comment.score);
      commentSubreddits.push(comment.subreddit);
    });

    submissions.data.forEach((submission) => {
      submissionScores.push(submission.score);
      submissionSubreddits.push(submission.subreddit);
    });

    redditDataModel.metrics.medianScoreComments = this.getMedianOfNumberArray(
      commentScores,
    );
    redditDataModel.metrics.medianScoreSubmissions = this.getMedianOfNumberArray(
      submissionScores,
    );

    redditDataModel.metrics.averageScoreComments = this.getAverageOfNumberArray(
      commentScores,
    );
    redditDataModel.metrics.averageScoreSubmissions = this.getAverageOfNumberArray(
      submissionScores,
    );
    redditDataModel.metrics.totalComments = commentSubreddits.length;
    redditDataModel.metrics.totalSubmissions = submissionSubreddits.length;

    redditDataModel.context.subredditsForComments = getCountOfSubreddits(
      commentSubreddits,
    );
    redditDataModel.context.subredditsForSubmissions = getCountOfSubreddits(
      submissionSubreddits,
    );

    let mergedSubreddits: string[] = [];
    mergedSubreddits = mergedSubreddits.concat(submissionSubreddits, commentSubreddits);
    redditDataModel.context.subreddits = getCountOfSubreddits(
      mergedSubreddits,
    );

    return redditDataModel;
  }

  static async analyzeDetailedFunctionality(identifier: string): Promise<DetailedAnalysis> {
    const detailedAnalysis = await this.getDetailedAnalysis(identifier);
    if (detailedAnalysis.length === 0) {
      return {
        examplesUpdatedAt: null,
        toxicity: {
          text: null,
          value: null,
        },
        severeToxicity: {
          text: null,
          value: null,
        },
        insult: {
          text: null,
          value: null,
        },
        profanity: {
          text: null,
          value: null,
        },
        identityAttack: {
          text: null,
          value: null,
        },
        threat: {
          text: null,
          value: null,
        },
      };
    }

    console.log(detailedAnalysis);

    // const attributes = [
    //   'toxicity',
    //   'severeToxicity',
    //   'insult',
    //   'identityAttack',
    //   'threat',
    //   'profanity',
    // ];

    const maxBehaviorReducer = (
      max: {
        text: string,
        behavior: {
          toxicity: number,
          severeToxicity: number,
          insult: number,
          identityAttack: number,
          threat: number,
          profanity: number,
        }
      },
      current: {
        text: string,
        behavior: {
          toxicity: number,
          severeToxicity: number,
          insult: number,
          identityAttack: number,
          threat: number,
          profanity: number,
        }
      },
      label: 'toxicity' | 'severeToxicity' | 'insult' | 'identityAttack' | 'threat' | 'profanity',
    ) => {
      if (max.behavior[label] > current.behavior[label]) {
        return max;
      }
      return current;
    };

    const maxToxicity = detailedAnalysis
      .reduce((max, current) => maxBehaviorReducer(max, current, 'toxicity'));
    const maxSevereToxicity = detailedAnalysis
      .reduce((max, current) => maxBehaviorReducer(max, current, 'severeToxicity'));
    const maxInsult = detailedAnalysis
      .reduce((max, current) => maxBehaviorReducer(max, current, 'insult'));
    const maxIdentityAttack = detailedAnalysis
      .reduce((max, current) => maxBehaviorReducer(max, current, 'identityAttack'));
    const maxThreat = detailedAnalysis
      .reduce((max, current) => maxBehaviorReducer(max, current, 'threat'));
    const maxProfanity = detailedAnalysis
      .reduce((max, current) => maxBehaviorReducer(max, current, 'profanity'));

    const date = new Date();
    const exemplaryComments: DetailedAnalysis = {
      examplesUpdatedAt: date,
      toxicity: {
        text: maxToxicity.text,
        value: maxToxicity.behavior.toxicity,
      },
      severeToxicity: {
        text: maxSevereToxicity.text,
        value: maxSevereToxicity.behavior.severeToxicity,
      },
      insult: {
        text: maxInsult.text,
        value: maxInsult.behavior.insult,
      },
      identityAttack: {
        text: maxIdentityAttack.text,
        value: maxIdentityAttack.behavior.identityAttack,
      },
      threat: {
        text: maxThreat.text,
        value: maxThreat.behavior.threat,
      },
      profanity: {
        text: maxProfanity.text,
        value: maxProfanity.behavior.profanity,
      },
    };
    console.log(exemplaryComments);
    return exemplaryComments;
  }

  static async getDetailedAnalysis(identifier: string): Promise<{
    text: string,
    behavior: {
      toxicity: number,
      severeToxicity: number,
      insult: number,
      identityAttack: number,
      threat: number,
      profanity: number,
    }
  }[]> {
    return new Promise(async (resolve) => {
      const NUMBER_OF_POSTS_TO_CONSIDER = 30;

      log.info('DETAILED ANALYSIS', `Analyzing information (${identifier})`);

      const submissionsResponse = await Pushshift.getSubmissionsFromRedditUserOnPushshift(
        identifier,
      );
      const submissions: PushshiftRedditPost[] = submissionsResponse.data.data;

      const commentsResponse = await Pushshift.getCommentsFromRedditUserOnPushshift(
        identifier,
      );
      const comments: PushshiftRedditPost[] = commentsResponse.data.data;

      let posts: PushshiftRedditPost[] = [];
      posts = posts.concat(submissions, comments);

      posts = this.sortRedditPostsByCreatedUTC(posts);

      posts = posts.slice(0, NUMBER_OF_POSTS_TO_CONSIDER);

      const detailedAnalysis: {
        text: string,
        behavior: {
          toxicity: number,
          severeToxicity: number,
          insult: number,
          identityAttack: number,
          threat: number,
          profanity: number,
        }
      }[] = [];
      // We need a 'for await' because the promise can only resolve after the loop
      // eslint-disable-next-line no-restricted-syntax
      for await (const post of posts) {
        let postText: string = '';
        if (post.selftext !== undefined && post.selftext !== '' && post.selftext !== '[removed]') {
          const text = this.beautifyRedditText(post.selftext);
          if (text !== '') {
            postText = text;
          }
        } else if (post.body !== undefined && post.body !== '' && post.body !== '[removed]') {
          const text = this.beautifyRedditText(post.body);
          if (text !== '') {
            postText = text;
          }
        }
        if (postText !== '') {
          try {
            const behaviorResult = await PerspectiveContext.analyze(postText);
            const postAnalysis = {
              text: postText,
              behavior: {
                toxicity: behaviorResult.toxicity ?? 0,
                severeToxicity: behaviorResult.severeToxicity ?? 0,
                insult: behaviorResult.insult ?? 0,
                identityAttack: behaviorResult.identityAttack ?? 0,
                threat: behaviorResult.threat ?? 0,
                profanity: behaviorResult.profanity ?? 0,
              },
            };
            detailedAnalysis.push(postAnalysis);
          } catch (error) {
            console.log(error);
          }
        }
      }
      resolve(detailedAnalysis);
    });
  }

  static getAverageOfNumberArray(numberArray: number[]): number {
    if (numberArray.length === 0) {
      return 0;
    }
    let sum = 0;
    numberArray.forEach((element) => {
      sum += element;
    });
    return sum / numberArray.length;
  }

  static getMedianOfNumberArray(numberArray: number[]) {
    const numberArraySorted = numberArray.sort();
    let result: number;
    const mid = Math.floor(numberArraySorted.length / 2);
    result = numberArraySorted[mid];
    if (numberArraySorted.length % 2 === 0) {
      result = (numberArraySorted[mid - 1] + numberArraySorted[mid]) / 2;
    }
    if (Number.isNaN(result)) {
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
  static getTextSnippetsOfRedditPosts(
    submissions: PushshiftRedditPost[],
    comments: PushshiftRedditPost[],
  ) {
    let posts: PushshiftRedditPost[] = [];
    posts = posts.concat(submissions, comments);
    posts = RedditController.sortRedditPostsByCreatedUTC(posts);
    const textSnippets: string[] = [];
    posts.forEach((post) => {
      if (post.selftext !== undefined && post.selftext !== '' && post.selftext !== '[removed]') {
        const text = RedditController.beautifyRedditText(post.selftext);
        if (text !== '') {
          textSnippets.push(text);
        }
      } else if (post.body !== undefined && post.body !== '' && post.body !== '[removed]') {
        const text = RedditController.beautifyRedditText(post.body);
        if (text !== '') {
          textSnippets.push(text);
        }
      }
    });
    return textSnippets;
  }

  static sortRedditPostsByCreatedUTC(arrayOfRedditPosts: PushshiftRedditPost[]) {
    return arrayOfRedditPosts.sort((
      a: PushshiftRedditPost,
      b: PushshiftRedditPost,
    ) => b.created_utc - a.created_utc);
  }

  /**
   * Cleans up reddit text from text that would be difficult to interprete by an analytics tool
   * @param text
   * @returns
   */
  static beautifyRedditText(text: string) {
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
}

interface DetailedAnalysis {
  examplesUpdatedAt: Date | null,
  toxicity: {
    text: string | null,
    value: number | null,
  },
  severeToxicity: {
    text: string | null,
    value: number | null,
  },
  insult: {
    text: string | null,
    value: number | null,
  },
  identityAttack: {
    text: string | null,
    value: number | null,
  },
  threat: {
    text: string | null,
    value: number | null,
  },
  profanity: {
    text: string | null,
    value: number | null,
  },
}
