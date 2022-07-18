import * as express from 'express';

import trackingController from './trackingController.js';

const trackingRouter: express.Router = express.Router();

trackingRouter.post('/create', trackingController.create);
trackingRouter.post('/update/dysis', trackingController.updateDysis);

export default trackingRouter;
