const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwtUtils');

exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await User .findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword });
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


