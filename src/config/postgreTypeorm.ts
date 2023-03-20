import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import config from '../config';

const baseFolder = config.isProd ? '' : 'src/';
console.log("config.isProd", config.isProd);

const typeormConfig = {
  type: config.POSTGRES_CONNECTION,
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  synchronize: true, // TODO: Make false on production
  logging: true || ['error'], // TODO: Make ['error'] on production
  dropSchema: false, // TODO: Make true on test
  namingStrategy: new SnakeNamingStrategy(),
  entities: [`${baseFolder}model/*{.js,.ts}`, `${baseFolder}model/views/*{.js,.ts}`],
  migrations: [`${baseFolder}database/migration/**/*{.js,.ts}`],
  subscribers: [`${baseFolder}database/subscriber/**/*{.js,.ts}`],
  cli: {
    entitiesDir: `${baseFolder}model`,
    migrationsDir: `${baseFolder}database/migration`,
    subscribersDir: `${baseFolder}database/subscriber`,
  },
  cache: {},
} as ConnectionOptions;

export default typeormConfig;
