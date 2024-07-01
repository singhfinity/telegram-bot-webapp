import { DataSource } from 'typeorm';
import { User } from '../../Domain/Entities/User';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrations: ['src/Infrastructure/Database/Migrations/*.ts'],
});