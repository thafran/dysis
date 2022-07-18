import log from '../helpers/log.js';

/**
 * Return successful response with status true and status code 200
 * @param {Request} res
 * @param {String} msg optional
 * @return {Response}
 */
export function respondWithSuccess(
    res,
    msg = 'Request successfull',
) {
  log.info('RESPONSE', 'Request successfull with data response');
  const response = {
    success: true,
    message: msg,
  };
  return res.status(200).json(response);
};

/**
 * Return successful response with data and status code 200
 * @param {Response} res
 * @param {Object} data
 * @param {String} msg optional
 * @return {Response}
 */
export function respondWithSuccessAndData(
    res,
    data,
    msg = 'Request successfull with data response',
) {
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
 * @param {Request} res
 * @param {String} msg optional
 * @return {Response}
 */
export function respondWithErrorNotFound(res, msg = 'Resource not found') {
  log.warn('RESPONSE', 'Resource not found');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(404).json(response);
};

/**
 * Returns validation error response with status false and status code 400
 * @param {Response} res
 * @param {Object} validationErrors
 * @param {String} msg optional
 * @return {Response}
 */
export function respondWithValidationError(
    res,
    validationErrors,
    msg = 'Request not valid',
) {
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
 * @param {Response} res
 * @param {String} msg optional
 * @return {Response}
 */
export function respondWithError(res, msg = 'Internal server error') {
  log.error('RESPONSE', 'Internal server error');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(500).json(response);
};

/**
 * @param {Response} res
 * @param {String} msg
 * @return {Response}
 */
export function respondWithErrorUnauthorized(res, msg = 'Unauthorized') {
  log.warn('RESPONSE', 'Unauthorized');
  const response = {
    success: false,
    message: msg,
  };
  return res.status(401).json(response);
};
