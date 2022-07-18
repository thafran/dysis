import jsonwebtoken from 'jsonwebtoken';
import {body} from 'express-validator';
import dotenv from 'dotenv';

import {
  respondWithErrorUnauthorized,
  respondWithSuccessAndData,
} from './response.js';
import validate from './validate.js';
import log from '../helpers/log.js';

// Please set SECRET_TOKEN in .env file
dotenv.config();
const ENV = process.env;

/**
 *
 * @param {String} username
 * @return {String}
 */
export function generateAccessToken(username) {
  return jsonwebtoken.sign(
      // Payload
      {
        username: username,
      },
      // Secret token
      ENV.TOKEN_SECRET,
      // Configurations such as expiry
      {
        expiresIn: '14d',
      },
  );
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function validateAuthentication(req, res, next) {
  const token = req.headers['authorization'];
  if (token === null) respondWithErrorUnauthorized(res);
  jsonwebtoken.verify(token, ENV.TOKEN_SECRET, (err, data) => {
    if (err) {
      log.warn(err);
      return respondWithErrorUnauthorized(res);
    };
    log.info('AUTHENTICATED', data.username);
    req.user = data.username;
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
    (req, res) => {
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


