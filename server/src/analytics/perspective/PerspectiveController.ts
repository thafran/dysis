import { Request, Response } from 'express';
import { body } from 'express-validator';

import validate from '../../helpers/validate.js';
import { respondWithSuccessAndData } from '../../helpers/response.js';

import PerspectiveContext from './PerspectiveContext.js';

/**
 * This controller provides a simple endpoint to a chosen PerspectiveStrategy for testing
 * purposes. The used PerspectiveStrategy can be changed in the PerspectiveContext.
 */
export default class PerspectiveController {
  static analyzeComment = [
    // Validations using express-validator
    body('text')
      .exists()
      .withMessage('text in request body required')
      .isString()
      .withMessage('text must be a string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: Request, res: Response) => {
      const { text } = req.body;
      try {
        const analysis = await PerspectiveContext.analyze(text);
        const data = {
          perspective: analysis,
        };
        respondWithSuccessAndData(
          res,
          data,
          'Perspective returned the following data',
        );
      } catch (error) {
        console.log(error);
      }
    },
  ];
}
