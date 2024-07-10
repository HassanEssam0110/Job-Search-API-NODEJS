import { ApiError } from "../../utils/api-error.utils.js";


// Function to send error details during development
const sendErrorForDev = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    data: err.data,
    location: err.location,
    stack: err.stack
});

// Function to send error details during production
const sendErrorForProd = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    data: err.data,
});


// handle token errors Handler
const handleJWTInvalidSignature = () => new ApiError('Invalid token, please login again..', 401) // Handle invalid JWT signature error
const handleJWTTokenExpired = () => new ApiError('Expired Token, please login again..', 401)// Handle expired JWT token error


const handleLimitFileSize = () => new ApiError('File too large, maximum allowed size is 10MB', 400)// Handle multer error

// handle mongodb duplicate Error   
const duplicateErrorHandler = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    return new ApiError(`field value:${value} aleady exist. please use another`, 400);
};

// Global error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if (process.env.NODE_ENV === "development") {
        return sendErrorForDev(err, res)
    }
    else if (process.env.NODE_ENV === "production") {

        // Check for specific JWT errors and handle them accordingly
        if (err.name === 'JsonWebTokenError') err = handleJWTInvalidSignature();
        if (err.name === 'TokenExpiredError') err = handleJWTTokenExpired();
        if (err.code === 11000) err = duplicateErrorHandler(err);
        if (err.code === 'LIMIT_FILE_SIZE') err = handleLimitFileSize(err);

        return sendErrorForProd(err, res)
    }
}