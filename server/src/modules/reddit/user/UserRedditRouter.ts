import * as express from 'express';

import AuthenticationController from '../../../authentication/AuthenticationController.js';
import UserRedditController from './UserRedditController.js';

const userRedditRouter: express.Router = express.Router();

// userRedditRouter.post('/create', UserRedditController.create);
userRedditRouter.post('/update_timestamp', UserRedditController.update_timestamp);

// userRedditRouter.get('/', UserRedditController.analyze);
// redditRouter.get('/detailed', RedditController.analyzeDetailed);

// userRedditRouter.use(AuthenticationController.validateAuthentication);


export default userRedditRouter;
