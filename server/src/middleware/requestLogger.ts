import { Request, Response, NextFunction } from 'express';
import log from '../helpers/log.js';

/**
 * Middleware to log all requests prettified to console appended with a timestamp
 * @param req
 * @param next
 */
export function requestLogger(req: Request, _: Response, next: NextFunction): void {
  log.http(
    'REQUEST',
    `${req.method} ${req.path}`,
  );
  next();
}

export function loggerMiddleware(request: Request, _: Response, next: NextFunction) {
  console.log(`${request.method} ${request.path}`);
  next();
}
