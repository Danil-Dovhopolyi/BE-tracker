import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOpitons: DataSourceOptions = {
  type: 'postgres',
  database: 'financeTracker',
  username: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  synchronize: false,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
}
const dataSource = new DataSource(dataSourceOpitons);
export default dataSource;