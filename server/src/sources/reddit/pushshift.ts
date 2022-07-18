/* eslint-disable require-jsdoc */
import axios, {AxiosResponse} from 'axios';
import {query} from 'express-validator';
import * as express from 'express';

import log from '../../helpers/log.js';
import validate from '../../helpers/validate.js';
import {
  respondWithError,
  respondWithSuccess,
  respondWithSuccessAndData,
} from '../../helpers/response.js';
import errorLogger from '../../middleware/errorLogger.js';
import {Reddit} from '../reddit/Reddit.js';

import {PushshiftRedditCommentResponse, PushshiftRedditSubmissionResponse} from './pushshift.d'

async function getCommentsFromRedditUserOnPushshift(username: string) {
  log.info('PUSHSHIFT', `Requesting comments from ${username}`);
  const URL = 'https://api.pushshift.io/reddit/comment/search';
  const response: AxiosResponse<PushshiftRedditCommentResponse> = await axios.get(URL + '?author=' + username + '&limit=1000');
  return response;
}

async function getSubmissionsFromRedditUserOnPushshift(username: string) {
  log.info('PUSHSHIFT', `Requesting submissions from ${username}`);
  const URL = 'https://api.pushshift.io/reddit/submission/search';
  const response: AxiosResponse<PushshiftRedditSubmissionResponse> = await axios.get(URL + '?author=' + username + '&limit=1000');
  return response;
}

/**
 * Controller for handling incoming requests to test the Pushshift API
 * @param req request instance
 * @param res response instance
 */
class PushshiftController {
  /**
   * Perspective API Controller
   * @param req request instance
   * @param res response instance
   */
  static getComments = [
    // Validations using express-validator
    query('username')
        .exists().withMessage('username in query required')
        .isString().withMessage('username must be a string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: express.Request, res: express.Response) => {
      let username: string;
      if (req.query?.username) {
        username = req.query.username.toString();
      } else {
        throw new Error('No username');
      }
      const response: AxiosResponse<PushshiftRedditCommentResponse> = await getCommentsFromRedditUserOnPushshift(username);
      if (response.statusText !== 'OK') {
        respondWithError(res, 'Could not get data from Pushshift')
      }
      console.log(response);
      try {
        respondWithSuccessAndData(
            res,
            {pushshift: response.data},
            'Pushshift API returned the following data',
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          log.error('ERROR', error.message);
        } else {
          console.log('Unexpected error', error);
        }
      }
    },
  ];

  /**
   * Perspective API Controller
   * @param {Request} req request instance
   * @param {Response} res response instance
   */
  static getSubmissions = [
    // Validations using express-validator
    query('username')
        .exists().withMessage('username in query required')
        .isString().withMessage('username must be a string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: express.Request, res: express.Response) => {
      let username: string;
      if (req.query?.username) {
        username = req.query.username.toString();
      } else {
        throw new Error('No username');
      }
      const response = await getSubmissionsFromRedditUserOnPushshift(username);
      if (response.statusText !== 'OK') {
        respondWithError(res, 'Could not get data from Pushshift')
      }
      try {
        respondWithSuccessAndData(
            res,
            {pushshift: await response},
            'Pushshift API returned the following data',
        );
      } catch (error) {
          console.log(error)
      }
    },
  ];

  static debug = [
    async (_: express.Request, res: express.Response) => {
      // Call a method here and output the result as console.log
      console.log('Debug something here');
      respondWithSuccess(
          res,
          'See console for more debugging information',
      );
    },
  ];
}

export {
  PushshiftController,
  getCommentsFromRedditUserOnPushshift,
  getSubmissionsFromRedditUserOnPushshift,
};
