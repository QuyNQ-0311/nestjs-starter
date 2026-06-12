export const APP_CONFIG = {
  GLOBAL_PREFIX: 'api',
  SWAGGER_PATH: 'swagger',
  DEFAULT_PORT: 9000,
  DEFAULT_JWT_EXPIRES_IN: 3600,
} as const;

export const SWAGGER_CONFIG = {
  TITLE: 'API',
  DESCRIPTION: 'API description',
  VERSION: '1.0',
  BEARER_AUTH_NAME: 'JWT-auth',
} as const;
