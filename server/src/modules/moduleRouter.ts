import express from 'express';

import RedditRouter from './reddit/RedditRouter.js';
import UserRedditRouter from './reddit/user/UserRedditRouter.js';
import ZeitRouter from './zeit/ZeitRouter.js';

const moduleRouter = express();

moduleRouter.get('', (_, res) => {
  res.send('Module API is running');
});

// Register modules below
moduleRouter.use('/reddit', RedditRouter);
moduleRouter.use('/user', UserRedditRouter);
moduleRouter.use('/zeit', ZeitRouter);

export default moduleRouter;
