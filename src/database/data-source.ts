import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load biến môi trường từ .env
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'coolmate_db',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
