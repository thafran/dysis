import { Response } from 'express';
import { respondWithError } from '../helpers/response.js';

/**
 * Middleware function to handle errors occuring by sending error response
 * @param {Response} res
 */
export default function errorHandler(res: Response) {
  try {
    respondWithError(res);
  } catch (globalError) {
    console.log(globalError);
  }
}
