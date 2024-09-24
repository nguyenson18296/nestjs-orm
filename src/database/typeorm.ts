import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

import { AddingPostType1727148205883 } from "../../migrations/index";

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [
    AddingPostType1727148205883,
  ],
  migrationsTableName: 'migrations',
  synchronize: true
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);
