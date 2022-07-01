import {respondWithError} from '../helpers/response.js';
import {Response} from 'express';

/**
 * Middleware function to handle errors occuring by sending error response
 * @param {Response} res
 */
export default function errorHandler(res: Response) {
  respondWithError(res);
};
