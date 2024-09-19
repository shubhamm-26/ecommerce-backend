const jwt = require('jsonwebtoken');
const jwtUtils = require('../utils/jwtUtils');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = jwtUtils.verifyToken(token);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
};

module.exports = authenticate;
