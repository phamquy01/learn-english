import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3309,
  username: 'quypham',
  password: 'Abc123456',
  database: 'backend-db',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  logging: true,
};

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT) || 3309,
//   username: process.env.DB_USERNAME || 'quypham',
//   password: process.env.DB_PASSWORD || 'Abc123456',
//   database: process.env.DB_DATABASE || 'backend-db',
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/db/migrations/*.js'],
//   synchronize: false,
//   logging: true,
// };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
