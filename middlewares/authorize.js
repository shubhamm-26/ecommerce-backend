const User = require('../models/user');

const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId);

            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };
};

module.exports = authorize;
