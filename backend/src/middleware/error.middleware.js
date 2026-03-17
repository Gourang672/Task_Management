import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with request details
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle custom AppError instances (our custom errors)
  if (err.statusCode) {
    return sendError(res, err.message, err.statusCode);
  }

  // ==========================================
  // DATABASE ERRORS (MongoDB/Mongoose)
  // ==========================================

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = { message, statusCode: 400 };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error = { message, statusCode: 409 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    const message = `Validation failed: ${errors.join(', ')}`;
    error = { message, statusCode: 400 };
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    const message = 'Database connection failed';
    error = { message, statusCode: 503 };
  }

  if (err.name === 'MongoTimeoutError') {
    const message = 'Database operation timed out';
    error = { message, statusCode: 504 };
  }

  // ==========================================
  // AUTHENTICATION & AUTHORIZATION ERRORS
  // ==========================================

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authentication token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Authentication token has expired';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'NotBeforeError') {
    const message = 'Token not active yet';
    error = { message, statusCode: 401 };
  }

  // Passport.js errors
  if (err.name === 'AuthenticationError') {
    const message = err.message || 'Authentication failed';
    error = { message, statusCode: 401 };
  }

  // ==========================================
  // HTTP & REQUEST ERRORS
  // ==========================================

  // Request too large
  if (err.type === 'entity.too.large') {
    const message = 'Request entity too large';
    error = { message, statusCode: 413 };
  }

  // Unsupported media type
  if (err.type === 'entity.parse.failed') {
    const message = 'Invalid request format';
    error = { message, statusCode: 400 };
  }

  // ==========================================
  // FILE UPLOAD ERRORS
  // ==========================================

  // Multer file upload errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large';
        error = { message, statusCode: 413 };
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        error = { message, statusCode: 400 };
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name too long';
        error = { message, statusCode: 400 };
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value too long';
        error = { message, statusCode: 400 };
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields';
        error = { message, statusCode: 400 };
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        error = { message, statusCode: 400 };
        break;
      default:
        error = { message, statusCode: 400 };
    }
  }

  // ==========================================
  // RATE LIMITING ERRORS
  // ==========================================

  if (err.name === 'RateLimitError' || err.message?.includes('rate limit')) {
    const message = 'Too many requests, please try again later';
    error = { message, statusCode: 429 };
  }

  // ==========================================
  // CORS ERRORS
  // ==========================================

  if (err.message?.includes('CORS') || err.message?.includes('Not allowed by CORS')) {
    const message = 'Cross-origin request not allowed';
    error = { message, statusCode: 403 };
  }

  // ==========================================
  // NETWORK & EXTERNAL SERVICE ERRORS
  // ==========================================

  // Axios/network errors
  if (err.code === 'ECONNREFUSED') {
    const message = 'Service temporarily unavailable';
    error = { message, statusCode: 503 };
  }

  if (err.code === 'ENOTFOUND') {
    const message = 'Service not found';
    error = { message, statusCode: 503 };
  }

  if (err.code === 'ETIMEDOUT') {
    const message = 'Request timeout';
    error = { message, statusCode: 408 };
  }

  // ==========================================
  // VALIDATION ERRORS (Zod, Joi, etc.)
  // ==========================================

  if (err.name === 'ZodError') {
    const errors = err.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // ==========================================
  // GENERIC ERROR HANDLING
  // ==========================================

  // Handle known HTTP status codes
  if (typeof err.status === 'number' && err.status >= 400 && err.status < 600) {
    error = { message: err.message || 'Request failed', statusCode: err.status };
  }

  // Handle statusCode property
  if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600) {
    error = { message: err.message || 'Request failed', statusCode: err.statusCode };
  }

  // Default to 500 Internal Server Error
  const statusCode = error.statusCode || 500;
  const message = error.message || (statusCode === 500 ? 'Internal server error' : 'Something went wrong');

  // In production, don't leak error details
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    return sendError(res, 'Internal server error', 500);
  }

  return sendError(res, message, statusCode);
};