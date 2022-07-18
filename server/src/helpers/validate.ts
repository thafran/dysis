import {validationResult} from 'express-validator';
import {respondWithValidationError} from './response.js';
import { Request, Response, NextFunction } from 'express';

/**
 * Reject a request which contains validation errors with respondWithValidationError()
 * @param req
 * @param res
 * @param next 
 */
export default function validate(req: Request, res: Response, next: NextFunction): void {
  if (validationResult(req).isEmpty()) {
    next();
  } else {
    respondWithValidationError(res, validationResult(req).array());
  }
};
