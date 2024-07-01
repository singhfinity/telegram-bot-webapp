import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./Domain/Entities/User"
import * as dotenv from 'dotenv'

dotenv.config()

if (process.env.NODE_ENV === 'development') {
    console.log('DB_HOST:', process.env.DB_HOST)
    console.log('DB_PORT:', process.env.DB_PORT)
    console.log('DB_USERNAME:', process.env.DB_USERNAME)
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD)
    console.log('DB_NAME:', process.env.DB_NAME)
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
    entities: [User],
    migrations: ["src/Infrastructure/Database/Migrations/*.ts"],
    subscribers: [],
})