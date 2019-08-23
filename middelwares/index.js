const bodyParser = require('body-parser');
const limiter = require('./rateLimit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

module.exports = (app) => {
  app.use(helmet());
  app.use(limiter);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'sort',

    ]
  }));
};