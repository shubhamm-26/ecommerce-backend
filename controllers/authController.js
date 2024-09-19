const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwtUtils');
const nodemailer  = require('nodemailer');
const crypto = require('crypto');

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await User .findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const role = await determineUserRole(email);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        const token = jwt.generateToken(user._id);
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.generateToken(user._id);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.reset_token = resetToken;
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
            subject: 'Password Reset',
            text: `Click on the link to reset your password: http://localhost:3000/auth/reset-password/${resetToken}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ message: 'Email sent' });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    const {password } = req.body;
    const resetToken = req.params.resetToken;
    try {
        const user = await User.findOne({ reset_token: resetToken });
        if (!user) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        if (user.reset_token_expiration < Date.now()) {
            return res.status(400).json({ error: 'Token expired' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.reset_token = null;
        user.reset_token_expiration = null;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.googleLogin = async (req, res) => {
    const token = jwt.generateToken(req.user._id);
    res.status(200).json({ token });
}

async function determineUserRole(email) {
    const adminEmails = ['admin@ecommerce.com'];
    const role = adminEmails.includes(email) ? 'admin' : 'user';
    return role;
}

