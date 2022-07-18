import log from '../helpers/log.js';
import { Response } from 'express';

/**
 * Return successful response with status true and status code 200
 * @param res
 * @param msg optional
 * @return
 */
export function respondWithSuccess(
    res: Response,
    msg: string = 'Request successfull',
): Response {
  log.info('RESPONSE', 'Request successfull with data response');
  const response = {
    success: true,
    message: msg,
  };
  return res.status(200).json(response);
};

/**
 * Return successful response with data and status code 200
 * @param res
 * @param data
 * @param msg optional
 * @return
 */
export function respondWithSuccessAndData(
    res: Response,
    data: Object,
    msg: string = 'Request successfull with data response',
): Response {
  log.info('RESPONSE', 'Request successfull with data response');
  const response = {
    success: true,
    message: msg,
    data: data,
  };
  return res.status(200).json(response);
}

/**
 * Returns not found error with status false and status code 404
 * @param res
 * @param msg optional
 * @return
 */
export function respondWithErrorNotFound(res: Response, msg: string = 'Resource not found'): Response {
  log.warn('RESPONSE', 'Resource not found');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(404).json(response);
};

/**
 * Returns validation error response with status false and status code 400
 * @param res
 * @param validationErrors
 * @param msg optional
 * @return
 */
export function respondWithValidationError(
    res: Response,
    validationErrors: any,
    msg: string = 'Request not valid',
): Response {
  log.warn('RESPONSE', 'Validation error');
  const response = {
    success: false,
    message: msg,
    validationErrors,
  };
  return res.status(400).json(response);
};

/**
 * Returns error response with status false and status code 500
 * @param res
 * @param msg optional
 * @return
 */
export function respondWithError(res: Response, msg: string = 'Internal server error'): Response {
  log.error('RESPONSE', 'Internal server error');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(500).json(response);
};

/**
 * @param res
 * @param msg
 * @return
 */
export function respondWithErrorUnauthorized(res: Response, msg: string = 'Unauthorized'): Response {
  log.warn('RESPONSE', 'Unauthorized');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(401).json(response);
};
