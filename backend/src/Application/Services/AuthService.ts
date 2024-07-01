import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '../../Domain/Entities/User';
import { UserRepository } from '../../Infrastructure/Repositories/UserRepository';

export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async signUp(telegramId: string, password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = this.generateToken();

        const user = await this.userRepository.create({
            telegramId,
            password: hashedPassword,
            token,
            createdAt: new Date(),
        });

        return token;
    }

    async login(telegramId: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findByTelegramId(telegramId);

        if (!user || !user.password || !user.token) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return this.generateJwtToken(user);
    }

    private generateToken(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    async verifyToken(telegramId: string, token: string): Promise<string | null> {
        const user = await this.userRepository.findByTelegramId(telegramId);

        if (!user || user.token !== token) {
            return null;
        }

        return this.generateJwtToken(user);
    }

    private generateJwtToken(user: User): string {
        return jwt.sign({ id: user.id, telegramId: user.telegramId }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
    }
}