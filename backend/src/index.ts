import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { AppDataSource } from './Infrastructure/Database/database';
import { AuthController } from './API/Controllers/AuthController';
import { TelegramBotService } from './Application/Services/TelegramBotService';
import { authMiddleware } from './API/Middleware/authMiddleware';
import { UserRepository } from "./Infrastructure/Repositories/UserRepository";
import { AuthService } from "./Application/Services/AuthService";

const app = express();
app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(userRepository, authService);

app.post('/api/signup', authController.signUp.bind(authController));
app.post('/api/login', authController.login.bind(authController));
app.get('/api/user', authMiddleware, authController.getUserData.bind(authController));
app.post('/api/verify-token', authController.verifyToken.bind(authController));

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        const telegramBotService = new TelegramBotService(process.env.TELEGRAM_BOT_TOKEN!);
        telegramBotService.setupCommands();
    })
    .catch((error) => console.log('Database connection failed', error));