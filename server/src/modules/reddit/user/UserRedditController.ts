import { body, query } from 'express-validator';
import { Request, Response } from 'express';

import {
  respondWithSuccess,
  respondWithError,
} from '../../../helpers/response.js';
import validate from '../../../helpers/validate.js';
import UserRedditModel from './UserRedditModel.js';
import log from '../../../helpers/log.js';


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
    validate,
    async (req: Request, res: Response) => {
        try {
            let user_reddit = await UserRedditModel.findOne({ identifier: req.body.identifier });
            
            if (await user_reddit === null) {
                try {
                    user_reddit = await UserRedditModel.create(
                        {
                        identifier: req.body.identifier,
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
              var last_element = user_reddit.active_timestamps[user_reddit.active_timestamps.length - 1];
              log.info('USERREDDIT', 'Added timestamp:', user_reddit.active_timestamps[user_reddit.active_timestamps.length - 1], "for", user_reddit.identifier);
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