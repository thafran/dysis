import Perspective from 'perspective-api-client';
import {body} from 'express-validator';
import dotenv from 'dotenv';

import log from '../../../helpers/log.js';
import validate from '../../../helpers/validate.js';
import {respondWithSuccessAndData} from '../../../helpers/response.js';

// Get confif variables
dotenv.config();
const ENV = process.env;

const API_KEY = ENV.GOOGLE_API_KEY;
const perspectiveAPI = new Perspective({
  apiKey: API_KEY,
});

/**
 * Analyzes a given text via the Perspective API
 * @param {String} text Text to be analyzed
 * @return {Result} Response from Perspective API
 */
async function perspectiveAnalysis(text) {
  log.info(
      'PERSPECTIVE API',
      `Requesting perspective API for the text:\n\"${text.slice(0, 280)}\"`,
  );
  try {
    const result = await perspectiveAPI.analyze({
      'comment': {
        'text': text,
      },
      // List attributes which should be analyzed
      'requestedAttributes': {
        'TOXICITY': {},
        'SEVERE_TOXICITY': {},
        'IDENTITY_ATTACK': {},
        'INSULT': {},
        'PROFANITY': {},
        'THREAT': {},
      },
      'spanAnnotations': false,
      'doNotStore': true,
    });
    return result;
  } catch (err) {
    log.error(err);
    return null;
  }
}

/**
 * Controller for handling incoming requests to test the Perspective API
 */
class PerspectiveController {
  /**
   * Perspective API Controller
   * @param {Request} req request instance
   * @param {Response} res response instance
   */
  static analyzeComment = [
    // Validations using express-validator
    body('text')
        .exists().withMessage('text in request body required')
        .isString().withMessage('text must be a string'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req, res) => {
      const text = req.body.text;
      const analysis = await perspectiveAnalysis(text);
      try {
        const data = {
          perspective: analysis,
        };
        respondWithSuccessAndData(
            res,
            data,
            'Perspective API returned the following data',
        );
      } catch (e) {
        log.error(e);
      }
    },
  ];
}

export {perspectiveAnalysis, PerspectiveController};
