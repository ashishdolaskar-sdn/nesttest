// constants.ts

export const HttpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  export const ErrorMessages = {
    USER_EXISTS: 'User with this email already exists',
    SHORT_PASSWORD: 'Password must be at least 6 characters long',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_ALREADY_INVALIDATED: 'Token has already been invalidated',
    INVALID_TOKEN: 'Invalid token',
    USER_NOT_FOUND: 'User not found',
  };
  