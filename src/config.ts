import { URL } from "url";

import {
  cleanEnv,
  str,
  port,
  url,
  host,
  num,
  CleanedEnvAccessors,
  email,
} from "envalid";
import dotenv from "dotenv";

dotenv.config();

type Environment = {
  NODE_ENV: string;
  PORT: number;
  SERVER_URL: string;
  LOG_LEVEL: string;
  SECRET_HEX: string;
  ACCESS_TOKEN_LIFETIME_MIN: number;
  REFRESH_TOKEN_LIFETIME_MIN: number;
  MAX_FILE_SIZE_IN_MB: number;
  MAX_APK_FILE_SIZE_IN_MB: number;
  GLOBAL_REQUEST_TIMEOUT_IN_MS: number;
  OPEN_API_MAX_REQUEST: number;
  OPEN_API_WINDOW_IN_MS: number;
  CLOSED_API_MAX_REQUEST: number;
  CLOSED_API_WINDOW_IN_MS: number;
  FRONTEND_BASE_URL: string;
  FRONTEND_CHANGE_PASSWORD_URL: string;
  FRONTEND_VERIFY_EMAIL_URL: string;
  POSTGRES_CONNECTION: string;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  CACHE_DURATION_IN_MS: number;
  GMAIL_USER: string;
  ADMIN_CONTACT_EMAIL: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  GMAIL_PASSWORD: string;
};

export type Env = Readonly<Environment & CleanedEnvAccessors>;

const env: Env = cleanEnv<Environment>(process.env, {
  NODE_ENV: str({
    choices: ["production", "test", "development"],
    default: "production",
  }),
  PORT: port({ default: 3333 }),
  SERVER_URL: url(),
  LOG_LEVEL: str({
    default: "error",
    choices: ["error", "warn", "info", "http", "verbose", "debug", "silly"],
  }),
  SECRET_HEX: str(),
  ACCESS_TOKEN_LIFETIME_MIN: num(),
  REFRESH_TOKEN_LIFETIME_MIN: num(),
  MAX_FILE_SIZE_IN_MB: num({ default: 1 }),
  MAX_APK_FILE_SIZE_IN_MB: num({ default: 1 }),
  GLOBAL_REQUEST_TIMEOUT_IN_MS: num({ default: 1000 * 60 * 5 }),
  OPEN_API_MAX_REQUEST: num({ default: 3 }),
  OPEN_API_WINDOW_IN_MS: num({ default: 1000 }),
  CLOSED_API_MAX_REQUEST: num({ default: 3 }),
  CLOSED_API_WINDOW_IN_MS: num({ default: 1000 }),
  FRONTEND_BASE_URL: str(),
  FRONTEND_CHANGE_PASSWORD_URL: str(),
  FRONTEND_VERIFY_EMAIL_URL: str(),
  POSTGRES_CONNECTION: str({
    default: "postgres",
    choices: ["postgres"],
  }),
  POSTGRES_HOST: host({ default: "localhost" }),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str({ default: "test" }),
  POSTGRES_PORT: port({ default: 5432 }),
  CACHE_DURATION_IN_MS: num({ default: 1000 * 7 }),
  GMAIL_USER: email(),
  ADMIN_CONTACT_EMAIL: email(),
  GMAIL_PASSWORD: str(),
  GMAIL_CLIENT_ID: str({ default: undefined }),
  GMAIL_CLIENT_SECRET: str({ default: undefined }),
  GMAIL_REFRESH_TOKEN: str({ default: undefined }),
});

export default env;
