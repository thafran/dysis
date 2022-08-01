import express from 'express';

import AuthenticationController from './AuthenticationController.js';

const AuthenticationRouter = express();

AuthenticationRouter.get('/authenticate', AuthenticationController.authenticate);

export default AuthenticationRouter;
