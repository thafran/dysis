import * as express from 'express';

import redditController from './redditController.js';

const redditRouter: express.Router = express.Router();

redditRouter.post('/get', redditController.get);
redditRouter.post('/analyze', redditController.analyze);
redditRouter.get('/', redditController.analyze);
redditRouter.post('/', redditController.createOne);

export default redditRouter;
