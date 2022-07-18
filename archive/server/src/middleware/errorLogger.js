import log from '../helpers/log.js';

/**
 * Middleware to log errors
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
export default function errorLogger(err, req, res, next) {
  log.error('SERVER ERROR', err.stack);
  next(err);
}
