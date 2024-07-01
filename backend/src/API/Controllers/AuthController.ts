import { Request, Response } from 'express';
import { AuthService } from '../../Application/Services/AuthService';
import { UserRepository } from '../../Infrastructure/Repositories/UserRepository';

export class AuthController {
    private authService: AuthService;
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository, authService: AuthService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async signUp(req: Request, res: Response): Promise<void> {
        const { telegramId, password } = req.body;

        try {
            const existingUser = await this.userRepository.findByTelegramId(telegramId);
            if (existingUser) {
                res.status(400).json({ error: 'User already exists' });
                return;
            }

            const token = await this.authService.signUp(telegramId, password);
            res.status(201).json({ token });
        } catch (error) {
            res.status(400).json({ error: 'Sign up failed' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { telegramId, password } = req.body;

        try {
            const jwtToken = await this.authService.login(telegramId, password);
            if (jwtToken) {
                res.json({ token: jwtToken });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    }

    async getUserData(req: Request, res: Response): Promise<void> {
        const userId = (req as any).user.id;

        try {
            const user = await this.userRepository.findById(userId);
            if (user) {
                res.json({
                    telegramId: user.telegramId,
                    createdAt: user.createdAt
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user data' });
        }
    }

    async verifyToken(req: Request, res: Response): Promise<void> {
        const { telegramId, token } = req.body;

        if (!telegramId || !token) {
            res.status(400).json({ error: 'Telegram ID and token are required' });
            return;
        }

        try {
            const jwtToken = await this.authService.verifyToken(telegramId, token);
            if (jwtToken) {
                res.json({ jwt: jwtToken });
            } else {
                res.status(401).json({ error: 'Invalid token' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Token verification failed' });
        }
    }
}