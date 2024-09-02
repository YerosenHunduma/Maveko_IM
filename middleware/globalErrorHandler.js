import { errorHandler } from '../utils/errorHandler.js';

export default (err, req, res, next) => {
    let error = {
        message: err.message || 'Internal server error',
        statusCode: err.statusCode || 500
    };

    // handle mongoose depulicate key error
    if (err?.code === 11000) {
        const message = `${Object.keys(err?.keyValue)} already taken. Please try with different ${Object.keys(err?.keyValue)} `;
        error = new errorHandler(message, 400);
    }

    if (process.env.NODE_ENV == 'PRODUCTION') {
        res.status(error.statusCode).json(error.message);
    }

    if (process.env.NODE_ENV == 'DEVELOPMENT') {
        res.status(error.statusCode).json({ message: error.message, error: err, stack: err?.stack });
    }
};
