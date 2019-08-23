const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  status: {
    type: String,
    enum: {
      values: ['guest', 'user', 'admin'],
      message: 'A status difficulty must be guest, user ore admin'
    },
    default: 'guest'
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: [8, 'Password must have more ore equal then 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    select: false,
    validate: {
      validator: function(val) {
        //work only create DOC
        return val === this.password;
      },
      message: 'PasswordConfirm doesn\'t equal password'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  versionKey: false,
  timestamps: true
});


UserSchema.methods.changePasswordAfter = function(JWTTimestamp) {

  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};


UserSchema.methods.checkPassword = async function(getPassword, userPassword) {
  return await bcrypt.compare(getPassword, userPassword);
};


UserSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);

  this.passwordConfirm = null;
  next();

});



UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;  // add 10 minutes

  return resetToken;
};


module.exports = User = mongoose.model('User', UserSchema);