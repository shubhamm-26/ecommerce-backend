const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

router.post('/login', userController.login);

router.post('/signup', userController.signup);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:resetToken', userController.resetPassword);

module.exports = router;