export const Errors = {
  AUTH: {
    INVALID_CREDENTIALS: {
      code: 'AUTH_001',
      message: 'Invalid credentials',
      statusCode: 401,
    },
    USER_NOT_FOUND: {
      code: 'AUTH_002',
      message: 'User not found',
      statusCode: 404,
    },
    INVALID_REFRESH_TOKEN: {
      code: 'AUTH_003',
      message: 'Invalid refresh token',
      statusCode: 401,
    },
    EMAIL_EXISTS: {
      code: 'AUTH_004',
      message: 'Email already exists',
      statusCode: 409,
    },
    USER_INACTIVE: {
      code: 'AUTH_005',
      message: 'User is inactive',
      statusCode: 403,
    },
    REFRESH_TOKEN_REQUIRED: {
      code: 'AUTH_006',
      message: 'Refresh token is required',
      statusCode: 400,
    },
    INVALID_PLATFORM: {
      code: 'AUTH_007',
      message: 'Invalid platform',
      statusCode: 401,
    },
  },
  USER: {
    NOT_FOUND: {
      code: 'USER_001',
      message: 'User not found',
      statusCode: 404,
    },
    EMAIL_EXISTS: {
      code: 'USER_002',
      message: 'Email already exists',
      statusCode: 409,
    },
    UNAUTHORIZED: {
      code: 'USER_003',
      message: 'Unauthorized to access this resource',
      statusCode: 403,
    },
  },
  DEFAULT: {
    INTERNAL_ERROR: {
      code: 'ERR_001',
      message: 'Internal server error',
      statusCode: 500,
    },
    BAD_REQUEST: {
      code: 'ERR_002',
      message: 'Bad request',
      statusCode: 400,
    },
    NOT_FOUND: {
      code: 'ERR_003',
      message: 'Resource not found',
      statusCode: 404,
    },
  },
} as const;
