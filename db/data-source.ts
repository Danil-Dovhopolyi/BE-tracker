import { DataSource, DataSourceOptions } from "typeorm";
import { config } from 'dotenv';

config();

export const dataSourceOpitons: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_DATABASE || 'financeTracker',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
}

const dataSource = new DataSource(dataSourceOpitons);
export default dataSource;