import * as express from 'express';
import log from '../helpers/log.js';

/**
 * Middleware to log all requests prettified to console appended with a timestamp
 * @param req
 * @param res
 * @param next
 */
export function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction): void {
  log.http(
      'REQUEST',
      req.method + ' ' + req.path,
  );
  next();
};


export function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
  console.log(`${request.method} ${request.path}`);
  next();
}
 