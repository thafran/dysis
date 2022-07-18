/* eslint-disable require-jsdoc */
import axios from 'axios';
import {query} from 'express-validator';

import log from '../../helpers/log.js';
import validate from '../../helpers/validate.js';
import {
  respondWithSuccess,
  respondWithSuccessAndData,
} from '../../helpers/response.js';

async function getCommentsFromRedditUserOnPushshift(username) {
  log.info('PUSHSHIFT', `Requesting comments from ${username}`);
  const URL = 'https://api.pushshift.io/reddit/comment/search';
  const response = await axios(URL + '?author=' + username + '&limit=1000');
  return await response.data;
}

async function getSubmissionsFromRedditUserOnPushshift(username) {
  log.info('PUSHSHIFT', `Requesting submissions from ${username}`);
  const URL = 'https://api.pushshift.io/reddit/submission/search';
  const response = await axios(URL + '?author=' + username + '&limit=1000');
  return await response.data;
}

/**
 * Controller for handling incoming requests to test the Pushshift API
 * @param {Request} req request instance
 * @param {Response} res response instance
 */
class PushshiftController {
  /**
   * Perspective API Controller
   * @param {Request} req request instance
   * @param {Response} res response instance
   */
  static getComments = [
    // Validations using express-validator
    query('username')
        .exists().withMessage('username in query required')
        .isString().withMessage('username must be a string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req, res) => {
      const username = req.query.username;
      const response = await getCommentsFromRedditUserOnPushshift(username);
      try {
        respondWithSuccessAndData(
            res,
            {pushshift: await response},
            'Pushshift API returned the following data',
        );
      } catch (e) {
        log.error(e);
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
    async (req, res) => {
      const username = req.query.username;
      const response = await getSubmissionsFromRedditUserOnPushshift(username);
      try {
        respondWithSuccessAndData(
            res,
            {pushshift: await response},
            'Pushshift API returned the following data',
        );
      } catch (e) {
        log.error(e);
      }
    },
  ];

  static debug = [
    async (req, res) => {
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
