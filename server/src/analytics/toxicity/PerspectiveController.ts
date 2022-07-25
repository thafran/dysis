import {Request, Response} from 'express';
import {body} from 'express-validator';

import validate from '../../helpers/validate.js';
import {respondWithSuccessAndData} from '../../helpers/response.js';

import {ToxicityContext} from '../ToxicityContext.js';

export class PerspectiveController {
  static analyzeComment = [
    // Validations using express-validator
    body('text')
        .exists().withMessage('text in request body required')
        .isString().withMessage('text must be a string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: Request, res: Response) => {
      const text = req.body.text;
      try {
        const analysis = await ToxicityContext.analyze(text);
        const data = {
          perspective: analysis,
        };
        respondWithSuccessAndData(
            res,
            data,
            'Perspective returned the following data',
        );
      } catch (error) {
        console.log(error)
      }
    },
  ];
}
