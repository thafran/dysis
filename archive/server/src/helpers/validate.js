import {validationResult} from 'express-validator';
import {respondWithValidationError} from './response.js';

const validate = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    next();
  } else {
    respondWithValidationError(res, validationResult(req).errors);
  }
};

export default validate;
