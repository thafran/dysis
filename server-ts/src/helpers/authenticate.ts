import jsonwebtoken from 'jsonwebtoken';
import {body} from 'express-validator';
import dotenv from 'dotenv';
import {Request, Response, NextFunction} from 'express';

import {
  respondWithErrorUnauthorized,
  respondWithSuccessAndData,
} from './response.js';
import validate from './validate.js';
import log from '../helpers/log.js';

// Please set SECRET_TOKEN in .env file
dotenv.config();
const ENV: NodeJS.ProcessEnv = process.env;
const secret: string = ENV.TOKEN_SECRET ? ENV.TOKEN_SECRET : '';

/**
 *
 * @param username
 * @return
 */
export function generateAccessToken(username: string) {
  return jsonwebtoken.sign(
      // Payload
      {
        username: username,
      },
      // Secret token
      secret,
      // Configurations such as expiry
      {
        expiresIn: '14d',
      },
  );
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function validateAuthentication(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];
  if (token === null || token === undefined) {
    respondWithErrorUnauthorized(res)
  };
  jsonwebtoken.verify(token ? token : '', secret, (err: any, data: any) => {
    if (err) {
      log.warn('ERROR', err.toString());
      return respondWithErrorUnauthorized(res);
    };
    log.info('AUTHENTICATED', data.username);
    res.locals.user = data.username;
    next();
  });
};

/**
 * Simple controller for authentication that can be re-factored if this
 * controller becomes relevant
 * @param {Request} req
 * @param {Response} res
 */
export class AuthenticationController {
  static authenticate = [
    body('username')
        .exists().isString(),
    body('password')
        .exists().isString(),
    validate,
    (req: Request, res: Response) => {
      // Simple super user validation with .env variables
      const adminUsername = ENV.ADMIN_USERNAME;
      const adminPassword = ENV.ADMIN_PASSWORD;
      if (req.body.username === adminUsername &&
          req.body.password === adminPassword
      ) {
        const data = {
          token: generateAccessToken(req.body.username),
        };
        respondWithSuccessAndData(res, data);
      } else {
        respondWithErrorUnauthorized(res, 'Wrong credentials provided');
      };
    },
  ];
}

