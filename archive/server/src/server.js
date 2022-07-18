// External imports
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Internal improts
import log from './helpers/log.js';
import errorHandler from './middleware/errorHandler.js';
import errorLogger from './middleware/errorLogger.js';
import router from './router.js';

// Constants
dotenv.config();
const ENV = process.env;
const DEFAULT_PORT = 8080;

// Setup server
const app = express();
log.info('SERVER START');
log.info('SERVER START', 'Started server ...');

// Connect database
try {
  await mongoose.connect(ENV.MONGODB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true,
      })
      .then(() => {
        log.info('SERVER START', 'Database is connecting ...');
      });
} catch (err) {
  log.error(err);
}
const db = mongoose.connection;
if (db.readyState) log.info('SERVER START', 'Database is connected ...');

// Listen for error events on database
db.on('connected', () => log.info('DATABASE', 'Database is connected'));
db.on('error', (err) => log.error('DATABASE', err));
db.on('disconnected', () => log.warn('DATABASE', 'Database is disconnected'));

// Configure server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Setup port (get from .env or use default 8080)
const port = ENV.PORT || DEFAULT_PORT;
app.listen(port, () => {
  log.info('SERVER START', `Server is listening on port ${port} ...`);
});

// Forward requests to router
app.use('', router);

// Catch all resources not found
router.all('*', function(_, res) {
  log.warn('RESPONSE', 'Resource not found');
  res.status(404).json({status: false, message: 'Resource not found'});
});

// Middleware for error handling
app.use(errorLogger);
app.use(errorHandler);
