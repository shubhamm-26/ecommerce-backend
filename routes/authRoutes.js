const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const passport = require('passport');

router.post('/login', userController.login);

router.post('/signup', userController.signup);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.googleLogin);

module.exports = router;