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
    REFRESH_TOKEN_EXPIRED: {
      code: 'AUTH_008',
      message: 'Refresh token expired',
      statusCode: 401,
    },
    REFRESH_TOKEN_REUSED: {
      code: 'AUTH_009',
      message: 'Refresh token reuse detected, all sessions revoked',
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
    INVALID_ROLES: {
      code: 'USER_004',
      message: 'One or more roles not found or inactive',
      statusCode: 400,
    },
  },
  ROLE: {
    CODE_EXISTS: {
      code: 'ROLE_001',
      message: 'Role code already exists in this platform',
      statusCode: 409,
    },
    NOT_FOUND: {
      code: 'ROLE_002',
      message: 'Role not found',
      statusCode: 404,
    },
    INVALID_PERMISSIONS: {
      code: 'ROLE_003',
      message: 'One or more permissions not found or inactive',
      statusCode: 400,
    },
  },
  PERMISSION: {
    CODE_EXISTS: {
      code: 'PERMISSION_001',
      message: 'Permission code already exists',
      statusCode: 409,
    },
    NOT_FOUND: {
      code: 'PERMISSION_002',
      message: 'Permission not found',
      statusCode: 404,
    },
    INSUFFICIENT: {
      code: 'PERMISSION_003',
      message: 'Insufficient permissions',
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
