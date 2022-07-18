import {Request, Response, NextFunction}from 'express';
import log from '../helpers/log.js';

import errorHandler from './errorHandler.js';

/**
 * Middleware to log errors
 * @param err
 * @param res
 */
export default function errorLogger(err: Error, res: Response) {
  log.error('SERVER ERROR', err.stack ? err.stack : err.toString());
  errorHandler(res)
}
