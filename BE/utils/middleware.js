const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

const corsMiddleware = (app) => {
    const corsOptions = {
        origin: [   'https://note-ku.vercel.app','http://localhost:5173','http://localhost:3000' ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(limiter);
    app.use(require('cors')(corsOptions));
};

module.exports = { corsMiddleware };
