import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/../entities/*.entity{.js,.ts}', __dirname + '/../modules/*/entities/*.entity{.js,.ts}'],
  applicationName: 'CDP-UTFPR API',
};
