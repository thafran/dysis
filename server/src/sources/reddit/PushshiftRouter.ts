import express from 'express';
import PushshiftController from './PushshiftController.js';

const PushshiftRouter = express();

PushshiftRouter.get('/getComments', PushshiftController.getComments);
PushshiftRouter.get('/getSubmissions', PushshiftController.getSubmissions);

export default PushshiftRouter;
