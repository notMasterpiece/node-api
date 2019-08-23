const AppError = require('../utils/appError');

const catchMongoErrors = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('! ')}`;
  return new AppError(message, 400);
};

const catchJwtErrors = (err) => {
  return new AppError('Invalid token. Please log in again', 401);
};

const catchJwtExpiredErrors = (err) => {
  return new AppError('Token expired. Please log in again', 401);
};


const sendErrorDev = (err, res) => {
  res
    .status(err.statusCode)
    .json({
      NODE_ENV: process.env.NODE_ENV,
      message: err.message,
      error: err,
      stack: err.stack
    });
};


const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({
        status: err.status,
        message: err.message
      });
  } else {
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Something went wrong'
      });
  }
};


module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {

    sendErrorDev(err, res);

  } else if (process.env.NODE_ENV === 'production') {

    if (err.name === 'ValidationError') err = catchMongoErrors(err);
    if (err.name === 'JsonWebTokenError') err = catchJwtErrors(err);
    if (err.name === 'TokenExpiredError') err = catchJwtExpiredErrors(err);

    sendErrorProd(err, res);

  }

};