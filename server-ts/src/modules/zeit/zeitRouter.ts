// ZEIT.de could be a future module

import express from 'express';

const zeitRouter: express.Router = express.Router();

zeitRouter.get('/', (_, res) => {
  res.send('ZEIT.de could be a future module');
});

export default zeitRouter;
