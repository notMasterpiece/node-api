const User = require('../models/userModel');
const withCatch = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUsers = withCatch(async (req, res, next) => {
  const users = await User
    .find({isActive: true});

  res
    .status(200)
    .json({
      count: users.length,
      status: 'success',
      users
    });
});




exports.createUser = withCatch(async (req, res, next) => {
  const user = await User.create(req.body);
  res
    .status(202)
    .json({
      status: 'success',
      user
    });
});


exports.updateViewer = withCatch(async (req, res, next) => {
  res.json({
    me: true
  })
});

exports.deleteUser = withCatch(async (req, res, next) => {
  const user = await User
    .findById(req.params.id)
    .select('+isActive');

  if (!user) return next(new AppError(`No user found with ID ${req.params.id}`), 404);

  user.isActive = false;
  await user.save();

  res
    .status(200)
    .json({ deleted: true });
});


