
const authorize = (roles) => {
    try{
        const user = req.user;
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = authorize;
