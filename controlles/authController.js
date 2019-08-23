const User = require('../models/userModel');
const withCatch = require('../utils/catchAsync');
const ArrError = require('../utils/appError');
const sendMail = require('../middelwares/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const singToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.SECRET_EXPIRES_IN
  });
};

exports.singUp = withCatch(async (req, res, next) => {

  const user = await User.create(req.body);

  const token = singToken(user.id);

  res
    .status(200)
    .json({
      status: 'success',
      token,
      user
    });
});


exports.login = withCatch(async (req, res, next) => {
  const { email, password } = req.body;

  //TODO add validation email, password

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ArrError('User doesn\'t exist', 404));

  const correct = await user.checkPassword(password, user.password);
  if (!correct) return next(new ArrError('Password doesn\'t correct', 401));

  const token = singToken(user.id);

  res
    .status(200)
    .json({ token });
});


exports.auth = withCatch(async (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) return next(new ArrError('Auth failed', 401));
  const decoded = await jwt.verify(token.split(' ')[1], process.env.SECRET);

  const user = await User.findById(decoded.id);


  if (!user) return next(new ArrError('User doesn\'t exist', 401));

  if (user.changePasswordAfter(decoded.iat)) {
    return next(new ArrError('User recently change password! Please log in again', 401));
  }

  req.user = user;
  next();
});


exports.forgotPassword = withCatch(async (req, res, next) => {

  // 1
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ArrError(`There is no user with with email address << ${req.body.email} >>`, 404));


  // 2
  const resetToken = await user.createPasswordResetToken();
  await user.save();


  // 3
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/auth/reset-password/${resetToken}`;
  const message = `Для восстановления пароля перейдите по <a href="${resetURL}">ссылке.</a> \n Если Вы не пытались восстановить пароль на нашем сайте, немедленно смените его и проигнорируйте это письмо. \n\n\n\n\n\ Команда tours.net`;


  try {
    await sendMail({
      email: req.body.email,
      subject: 'Reset Password',
      message
    });


    res
      .status(200)
      .json({
        status: '200',
        message: 'Token send to email'
      });
  } catch (err) {

    this.passwordResetToken = null;
    this.passwordResetExpires = null;
    await user.save();

    return next(new ArrError('There was an error on sending the email. Try again letter', 500));
  }


});


exports.resetPassword = withCatch(async (req, res, next) => {

  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return next(new ArrError('Token is expired', 400));

  user.password = password;
  user.passwordConfirm = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();


  const newToken = singToken(user.id);
  res
    .status(200)
    .json({ newToken });

});
