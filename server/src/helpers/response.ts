import { Response } from 'express';
import log from '../helpers/log.js';

/**
 * Below you may find multiple frequently used responses
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
}

export function respondWithSuccessAndData(
  res: Response,
  data: Object,
  msg: string = 'Request successfull with data response',
): Response {
  log.info('RESPONSE', 'Request successfull with data response');
  const response = {
    success: true,
    message: msg,
    data,
  };
  return res.status(200).json(response);
}

export function respondWithErrorNotFound(res: Response, msg: string = 'Resource not found'): Response {
  log.warn('RESPONSE', 'Resource not found');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(404).json(response);
}

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
}

export function respondWithError(res: Response, msg: string = 'Internal server error'): Response {
  log.error('RESPONSE', 'Internal server error');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(500).json(response);
}

export function respondWithErrorUnauthorized(res: Response, msg: string = 'Unauthorized'): Response {
  log.warn('RESPONSE', 'Unauthorized');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(401).json(response);
}

export function respondWithTooManyRequests(res: Response, msg: string = 'Too many requests'): Response {
  log.warn('RESPONSE', 'Too many requests');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(429).json(response);
}

export function respondWithNoContent(res: Response, msg: string = 'No content'): Response {
  log.warn('RESPONSE', 'No content');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(204).json(response);
}
