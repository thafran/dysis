import { body, query } from 'express-validator';
import { differenceInHours } from 'date-fns';
import { Request, Response } from 'express';

import {
  respondWithSuccess,
  respondWithNoContent,
  respondWithError,
} from '../../../helpers/response.js';
import validate from '../../../helpers/validate.js';
import UserRedditModel from './UserRedditModel.js';
// import { getCountOfSubreddits } from '../../helpers/utils.js';
// import PerspectiveContext from '../../analytics/perspective/PerspectiveContext.js';
import log from '../../../helpers/log.js';
// import PushshiftRedditPost from '../../sources/reddit/PushshiftInterface.js';
// import Pushshift from '../../sources/reddit/Pushshift.js';


export default class UserRedditController {
    /**
   * Creates a new study participant which is required.
   * @param req request instance (body: [

   * ])
   * @param res response instance
   */
  static create = [
    body('identifier')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be a string'),
    // body('active_timestamps')
    //   .exists()
    //   .withMessage('Value is required')
    //   .isString()
    //   .withMessage('Value needs to be a string (ISO date string)'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const user_reddit = await UserRedditModel.create(
          {
            identifier: req.body.identifier,
            active_timestamp: "",
          },
        );
        const data = {
          userID: user_reddit.id,
        };
        log.info('REDDITUSER', `Created reddit user '${user_reddit.identifier}'`);
        respondWithSuccess(
          res,
          `Created reddit user: ${user_reddit.identifier}`,
        );
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];
   /**
   * Writes to timestamp array the latest timestamp
   * @param req request instance (body: [

   * ])
   * @param res response instance
   */
  static update_timestamp = [
    body('identifier')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be a string'),
    // body('active_timestamps')
    //   .exists()
    //   .withMessage('Value is required')
    //   .isString()
    //   .withMessage('Value needs to be a string (ISO date string)'),
    validate,
    async (req: Request, res: Response) => {
        try {
            let user_reddit = await UserRedditModel.findOne({ identifier: req.body.identifier });
            log.info('USERREDDIT', user_reddit);
            
            if (await user_reddit === null) {
                try {
                    // var date_min = parseInt((Date.now() / 1000) / 60);
                    // log.info('USERREDDIT', date_min.toString());
                    user_reddit = await UserRedditModel.create(
                        {
                        identifier: req.body.identifier,
                        // active_timestamp: new Array<string>(Date.now().toString()),
                        active_timestamps: new Array<string>(Date.now().toString()),
                        },
                    );
                    log.info('REDDITUSER', `Created reddit user '${user_reddit.identifier}'`);
                    respondWithSuccess(
                    res,
                    `Created reddit user: ${user_reddit.identifier}`,
                    );
                } catch (error) {
                    console.log(error);
                    respondWithError(res);
                }
            } else {
              user_reddit.active_timestamps.push(Date.now());
              user_reddit.save();
              log.info('USERREDDIT', `Added timestamp.`);
              respondWithSuccess(
                res,
                'Updated participant',
              );
            }
          } catch (error) {
            log.error('USERREDDIT', `Error for ${req.body.identifier}'`);
            console.log(error);
            respondWithError(res);
          }
    },
  ];
};