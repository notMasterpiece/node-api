const express = require('express');
const router = express.Router();
const userControllers = require('../controlles/userController');
const authControllers = require('../controlles/authController');
const statusControllers = require('../controlles/statusController');

router
  .route('/')
  .get(authControllers.auth, statusControllers.isAdmin, userControllers.getUsers)
  .post(userControllers.createUser);


router
  .route('/me')
  .post(authControllers.auth, userControllers.updateViewer);


router
  .route('/:id')
  .delete(authControllers.auth, userControllers.deleteUser);


router
  .route('/auth/sing-up')
  .post(authControllers.singUp);


router
  .route('/auth/login')
  .post(authControllers.login);


router
  .route('/auth/forgot-password')
  .post(authControllers.forgotPassword);

router
  .route('/auth/reset-password/:token')
  .post(authControllers.resetPassword);


module.exports = router;