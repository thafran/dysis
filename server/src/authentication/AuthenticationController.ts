import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import log from '../helpers/log.js';
import validate from '../helpers/validate.js';
import { respondWithErrorUnauthorized, respondWithSuccessAndData } from '../helpers/response.js';

/**
 * This Authentication Controller implements a JWT (JSON Web Token) based authentication using the
 * jsonwebtoken npm package.
 */
export default class AuthenticationController {
  static TOKEN_EXPIRES_IN: string = '14d';

  /**
   * Public authenticate method which is an API implementation for a user to authenticate with
   * their credentials and returns a token if successfull. Otherwise an unauthorized error is
   * returned. The received token shall then be used in the header 'authorization'.
   */
  static authenticate = [
    body('username')
      .exists()
      .isString(),
    body('password')
      .exists()
      .isString(),
    validate,
    (req: Request, res: Response) => {
      // Simple super user validation with .env variables
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (req.body.username === adminUsername
        && req.body.password === adminPassword
      ) {
        const data = {
          token: AuthenticationController.generateAccessToken(req.body.username),
        };
        respondWithSuccessAndData(res, data);
      } else {
        respondWithErrorUnauthorized(res, 'Wrong credentials provided');
      }
    },
  ];

  /**
   * Middleware method validates an authentication. It checks the request for an 'authorization'
   * header which should contain a valid token. If this middleware method is chained in a request
   * but does not contain an 'authorization' header or the provided token is invalid. Then the
   * request is returned with an unauthorized error.
   */
  static validateAuthentication(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token === null || token === undefined) {
      respondWithErrorUnauthorized(res);
    }
    jsonwebtoken.verify(token || '', process.env.TOKEN_SECRET, (error: any, data: any) => {
      if (error) {
        log.warn('ERROR', error.toString());
        return respondWithErrorUnauthorized(res);
      }
      log.info('AUTHENTICATED', data.username);
      res.locals.user = data.username;
      return next();
    });
  }

  /**
   * Private helper method to generate a valid access token which is provided to the user upon
   * a successful authentication.
   */
  private static generateAccessToken(username: string) {
    return jsonwebtoken.sign(
      // Payload
      { username },
      // Token secret
      process.env.TOKEN_SECRET,
      // Configurations such as expiry
      { expiresIn: AuthenticationController.TOKEN_EXPIRES_IN },
    );
  }
}
