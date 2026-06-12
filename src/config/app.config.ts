import { registerAs } from '@nestjs/config';
import { APP_CONFIG } from '../common/constants/app.constant';

export default registerAs('app', () => ({
  env: process.env.APP_ENV || 'development',
  port: parseInt(process.env.PORT || String(APP_CONFIG.DEFAULT_PORT), 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  clientUrl: process.env.CLIENT_URL || '',
}));
