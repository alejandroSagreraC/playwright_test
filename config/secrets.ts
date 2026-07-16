import * as dotenv from 'dotenv';
import path from 'node:path';

const ENV = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `../.env.${ENV}`) });

export const Config = {
  baseUrl: process.env.BASE_URL,
  apiUrl: process.env.API_URL,
  adminUser: process.env.ADMIN_USER || 'default_user',
  // We throw an error if the password is missing to fail fast
  get adminPass(): string {
    if (!process.env.ADMIN_PASS) {
      throw new Error(`❌ MISSING SECRET: ADMIN_PASS is not defined for ${ENV} environment.`);
    }
    return process.env.ADMIN_PASS;
  }
};
