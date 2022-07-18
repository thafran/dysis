import {respondWithError} from '../helpers/response.js';

/**
 * Middleware function to handle errors occuring by sending error response
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export default function errorHandler(err, req, res, next) {
  respondWithError(res);
};
