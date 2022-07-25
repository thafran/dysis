/* eslint-disable require-jsdoc */

import {body} from 'express-validator';
import {Request, Response} from 'express';
import participantModel from './participantModel.js';

import validate from '../helpers/validate.js';
import {respondWithError, respondWithSuccess, respondWithSuccessAndData} from '../helpers/response.js';


export default class TrackingRouter {
  /**
   * Takes multiple identifiers in a post body and sends array of results
   * (array can be empty if no results are found)
   * Creates an reddit object
   * @param res response instance
   * @param res response instance
   */
  static create = [
    // Validations using express-validator
    body('participantFirstName')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be a string'),
    body('participantLastName')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be a string'),
    body('participantAgreedToTerms')
        .exists().withMessage('Value is required')
        .isBoolean().withMessage('Value needs to be a boolean'),
    body('participantSubmitted')
        .exists().withMessage('Value is required')
        .isBoolean().withMessage('Value needs to be a boolean'),
    body('participantInstallationDate')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be a string (ISO date string)'),
    // Using own helper to check for generated validation errors
    validate,
    // Actual controller method handling valid request
    async (req: Request, res: Response) => {
      try {
        const participant = await participantModel.create(
          {
            firstName: req.body.participantFirstName,
            lastName: req.body.participantLastName,
            agreedToTerms: req.body.participantAgreedToTerms,
            submitted: req.body.participantSubmitted,
            installationDate: req.body.participantInstallationDate
          }
        )
        const data = {
          participantID: participant.id
        }
        respondWithSuccessAndData(
          res,
          data,
          `Created participant: ${participant.firstName} ${participant.lastName}`,
        )
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    }
  ];

  static updateDysis = [
    body('participantID')
        .exists().withMessage('Value is required')
        .isString().withMessage('Value needs to be string'),
    body('totalUsageTime')
        .exists().withMessage('Value is required')
        .isNumeric().withMessage('Value needs to be UTC number'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const participant = await participantModel.findOne({id: req.body.participantID});
        if (participant === null) {
          respondWithError(res, 'Could not find participant')
        } else {
          participant.dysis.totalUsageTime = req.body.totalUsageTime;
          participant.save();
          respondWithSuccess(
            res,
            'Updated participant')
        }
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    }
  ];

  static all = [
    async (req: Request, res: Response) => {
      try {
        const participants = await participantModel.find({});
        respondWithSuccessAndData(
          res,
          participants,
          `Retrieved participant data`,
        )
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    }
  ];
}