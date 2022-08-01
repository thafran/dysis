/* eslint-disable require-jsdoc */
import { query } from 'express-validator';
import * as express from 'express';

import log from '../../helpers/log.js';
import validate from '../../helpers/validate.js';
import {
  respondWithError,
  respondWithSuccessAndData,
} from '../../helpers/response.js';

import Pushshift from './Pushshift.js';

/**
 * Controller to provide an endpoint to Pushshift mainly for testing purposes.
*/
export default class PushshiftController {
  /**
   * Returns up to 100 comments (not submissions) for a specified user
   * @param req request instance (query: ['username': string])
   * @param res response instance
   */
  static getComments = [
    // Validations using express-validator
    query('username')
      .exists()
      .withMessage('username in query required')
      .isString()
      .withMessage('username must be a string'),
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
      const response = await
      Pushshift.getCommentsFromRedditUserOnPushshift(username);
      if (response.statusText !== 'OK') {
        respondWithError(res, 'Could not get data from Pushshift');
      }
      console.log(response);
      try {
        respondWithSuccessAndData(
          res,
          { pushshift: response.data },
          'Pushshift API returned the following data',
        );
      } catch (error: any) {
        log.error('PUSHSHIFT', 'Error for method getComments()');
        console.log(error);
      }
    },
  ];

  /**
   * Returns up to 100 submissions (not comments) for a specified user.
   * @param req request instance (query: ['username': string])
   * @param res response instance
   */
  static getSubmissions = [
    // Validations using express-validator
    query('username')
      .exists()
      .withMessage('username in query required')
      .isString()
      .withMessage('username must be a string'),
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
      const response = await Pushshift.getSubmissionsFromRedditUserOnPushshift(username);
      if (response.statusText !== 'OK') {
        respondWithError(res, 'Could not get data from Pushshift');
      }
      try {
        respondWithSuccessAndData(
          res,
          { pushshift: response },
          'Pushshift API returned the following data',
        );
      } catch (error) {
        log.error('PUSHSHIFT', 'Error for method getSubmissions()');
        console.log(error);
      }
    },
  ];
}
