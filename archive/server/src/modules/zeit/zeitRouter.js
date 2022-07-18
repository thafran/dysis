// ZEIT.de could be a future module

import express from 'express';

const zeitRouter = new express.Router;

zeitRouter.get('/', (_, res) => {
  res.send('ZEIT.de could be a future module');
});

export default zeitRouter;
