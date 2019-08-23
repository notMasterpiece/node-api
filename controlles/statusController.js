const withCatch = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const admin = 'admin';

exports.isAdmin = withCatch(async (req, res, next) => {
  const {status} = req.user;

  if (status !== admin) return next(new AppError('You do not have permission to perform this action', 403));
  next();
});