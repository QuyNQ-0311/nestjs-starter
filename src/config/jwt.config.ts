import { registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';
import { APP_CONFIG } from '../common/constants/app.constant';

export default registerAs('jwt', () => {
  const expiresInRaw = process.env.JWT_EXPIRES_IN || '1h';
  const isNumeric = /^\d+$/.test(expiresInRaw);

  return {
    secret: process.env.JWT_SECRET,
    // Used as JwtModule signOptions.expiresIn (accepts seconds or a duration string like '1h')
    expiresIn: (isNumeric ? parseInt(expiresInRaw, 10) : expiresInRaw) as StringValue | number,
    // Seconds, returned to clients alongside the access token
    expiresInSeconds: isNumeric ? parseInt(expiresInRaw, 10) : APP_CONFIG.DEFAULT_JWT_EXPIRES_IN,
    refreshTokenExpiresIn: parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN || String(60 * 60 * 24 * 7),
      10,
    ),
  };
});
