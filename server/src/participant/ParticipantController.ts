import { body } from 'express-validator';
import { Request, Response } from 'express';
import ParticipantModel from './ParticipantModel.js';

import validate from '../helpers/validate.js';
import {
  respondWithError,
  respondWithSuccess,
  respondWithSuccessAndData,
} from '../helpers/response.js';

/**
 * Controller for participants which take part in the study and agreed to the terms.
 */
export default class ParticipantController {
  /**
   * Creates a new study participant which is required.
   * @param req request instance (body: [
   *  'participantFirstName': string,
   *  'participantLastName': string,
   *  'participantAgreedToTerms': boolean,
   *  'participantSubmitted': boolean,
   *  'participantInstallationDate': string (ISODate),
   * ])
   * @param res response instance
   */
  static create = [
    body('participantFirstName')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be a string'),
    body('participantLastName')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be a string'),
    body('participantAgreedToTerms')
      .exists()
      .withMessage('Value is required')
      .isBoolean()
      .withMessage('Value needs to be a boolean'),
    body('participantSubmitted')
      .exists()
      .withMessage('Value is required')
      .isBoolean()
      .withMessage('Value needs to be a boolean'),
    body('participantInstallationDate')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be a string (ISO date string)'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const participant = await ParticipantModel.create(
          {
            firstName: req.body.participantFirstName,
            lastName: req.body.participantLastName,
            agreedToTerms: req.body.participantAgreedToTerms,
            submitted: req.body.participantSubmitted,
            installationDate: req.body.participantInstallationDate,
          },
        );
        const data = {
          participantID: participant.id,
        };
        respondWithSuccessAndData(
          res,
          data,
          `Created participant: ${participant.firstName} ${participant.lastName}`,
        );
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];

  /**
   * Updates the totalUsageTime of a participant.
   * @param req request instance (body: [
   *  'participantID': string,
   *  'totalUsageTime': number,
   * ])
   * @param res response instance
   */
  static updateDysis = [
    body('participantID')
      .exists()
      .withMessage('Value is required')
      .isString()
      .withMessage('Value needs to be string'),
    body('totalUsageTime')
      .exists()
      .withMessage('Value is required')
      .isNumeric()
      .withMessage('Value needs to be number'),
    validate,
    async (req: Request, res: Response) => {
      try {
        const participant = await ParticipantModel.findOne({ _id: req.body.participantID });
        if (participant === null) {
          respondWithError(res, 'Could not find participant');
        } else {
          participant.dysis.totalUsageTime = req.body.totalUsageTime;
          participant.save();
          respondWithSuccess(
            res,
            'Updated participant',
          );
        }
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];

  /**
   * Returns all participant mainly used to observe the study progress. Access should only be
   * granted with authentication (see router).
   * @param req request instance
   * @param res response instance
   */
  static all = [
    async (_: Request, res: Response) => {
      try {
        const participants = await ParticipantModel.find({});
        respondWithSuccessAndData(
          res,
          participants,
          'Retrieved participant data',
        );
      } catch (error) {
        console.log(error);
        respondWithError(res);
      }
    },
  ];
}
