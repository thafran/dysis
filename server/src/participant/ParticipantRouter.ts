import * as express from 'express';
import AuthenticationController from '../authentication/AuthenticationController.js';
import ParticipantController from './ParticipantController.js';

const ParticipantRouter: express.Router = express.Router();

ParticipantRouter.post('/create', ParticipantController.create);
ParticipantRouter.post('/update/dysis', ParticipantController.updateDysis);

/** Authentication required below */
ParticipantRouter.use(AuthenticationController.validateAuthentication);

ParticipantRouter.get('/all', ParticipantController.all);

export default ParticipantRouter;
