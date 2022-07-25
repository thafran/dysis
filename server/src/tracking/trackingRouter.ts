import * as express from 'express';

import trackingController from './trackingController.js';
import {validateAuthentication} from '../helpers/authenticate.js';

const trackingRouter: express.Router = express.Router();

trackingRouter.post('/create', trackingController.create);
trackingRouter.post('/update/dysis', trackingController.updateDysis);

trackingRouter.use(validateAuthentication);
/** Authentication required below */

trackingRouter.get('/all', trackingController.all)

export default trackingRouter;
