import * as express from 'express';

import AuthenticationController from '../../authentication/AuthenticationController.js';
import RedditController from './RedditController.js';

const redditRouter: express.Router = express.Router();

redditRouter.get('/', RedditController.analyze);
redditRouter.get('/detailed', RedditController.analyzeDetailed);

redditRouter.use(AuthenticationController.validateAuthentication);
/** Authentication required for routes below */

redditRouter.get('/highest', RedditController.highest);
redditRouter.get('/average', RedditController.average);
redditRouter.get('/all', RedditController.all);

export default redditRouter;
