export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

// ==========================================
// 4xx CLIENT ERRORS
// ==========================================

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message = 'Method not allowed') {
    super(message, 405);
    this.name = 'MethodNotAllowedError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class GoneError extends AppError {
  constructor(message = 'Resource no longer available') {
    super(message, 410);
    this.name = 'GoneError';
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable entity') {
    super(message, 422);
    this.name = 'UnprocessableEntityError';
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.name = 'TooManyRequestsError';
  }
}

// ==========================================
// 5xx SERVER ERRORS
// ==========================================

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

export class NotImplementedError extends AppError {
  constructor(message = 'Not implemented') {
    super(message, 501);
    this.name = 'NotImplementedError';
  }
}

export class BadGatewayError extends AppError {
  constructor(message = 'Bad gateway') {
    super(message, 502);
    this.name = 'BadGatewayError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message = 'Gateway timeout') {
    super(message, 504);
    this.name = 'GatewayTimeoutError';
  }
}

// ==========================================
// SPECIALIZED ERRORS
// ==========================================

export class DatabaseError extends AppError {
  constructor(message = 'Database error') {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

export class FileUploadError extends AppError {
  constructor(message = 'File upload failed') {
    super(message, 400);
    this.name = 'FileUploadError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service = 'External service', statusCode = 502) {
    super(`${service} error`, statusCode);
    this.name = 'ExternalServiceError';
  }
}