const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const passport = require('passport');

router.post('/login', userController.login);

router.post('/signup', userController.signup);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:resetToken', userController.resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.googleLogin);

// 1. Go to http://localhost:3000/auth/google
// 2. You will be redirected to the Google login page
// 3. Enter your Google credentials
// 4. You will be redirected to the callback URL
// 5. Copy the URL and paste it in Postman
// 6. Send the request
// 7. You will receive the user object in the response
// 8. Copy the token and set it in the Authorization header
// 9. You can now access the protected routes

module.exports = router;