const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwtUtils');
const nodemailer = require('nodemailer');
const axios = require('axios');
const verifyRecaptcha = require('../utils/verifyRecaptcha');
const determineUserRole = require('../utils/determineRole');

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

exports.signup = async (req, res) => {
    const { name, email, password, recaptchaToken } = req.body;
    try {
        const recaptchaVerified = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaVerified) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const role = await determineUserRole(email);
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.generateToken(user._id);
        res.status(201).json({ user,token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password, recaptchaToken } = req.body;
    try {
        const recaptchaVerified = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaVerified) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.generateToken(user._id);
        res.status(200).json({user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.reset_token = otp;
        user.reset_token_expiration = Date.now() + 3600000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 1 hour.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ message: 'OTP sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const {email, otp, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        if (user.reset_token_expiration < Date.now()) {
            return res.status(400).json({ error: 'OTP expired' });
        }
        if (user.reset_token !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.reset_token= null;
        user.reset_token_expiration = null;
        await user.save();   
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    const token = jwt.generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/google?token=${token}`);
};


