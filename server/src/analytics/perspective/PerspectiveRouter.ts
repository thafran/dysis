import express from 'express';

import PerspectiveController from './PerspectiveController.js';

const PerspectiveRouter = express();

PerspectiveRouter.post('/analyzeComment', PerspectiveController.analyzeComment);

export default PerspectiveRouter;
