import { config } from 'dotenv';

config();

const env = process.env;

export const environments = {
  
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  accessTokenExpiration: env.ACCESS_TOKEN_EXPIRATION,
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiration: env.REFRESH_TOKEN_EXPIRATION,

}