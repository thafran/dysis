import express from 'express';

const moduleRouter = express();

moduleRouter.get('', (_, res) => {
  res.send(`Module API is running`);
});

// Register modules below

import redditRouter from './reddit/redditRouter.js';
moduleRouter.use('/reddit', redditRouter);

import zeitRouter from './zeit/zeitRouter.js';
moduleRouter.use('/zeit', zeitRouter);

export default moduleRouter;
