const requestLogger = (req, res, next) => {
    const start = Date.now(); 
    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        originalSend.apply(res, arguments);
    };
    next();
};

module.exports = requestLogger;
