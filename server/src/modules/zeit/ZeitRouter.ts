// ZEIT.de could be a future module
import express from 'express';

const ZeitRouter: express.Router = express.Router();

ZeitRouter.get('/', (_, res) => {
  res.send('ZEIT.de could be a future module');
});

export default ZeitRouter;
