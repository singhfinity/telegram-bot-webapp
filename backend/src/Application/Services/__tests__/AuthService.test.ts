import { AuthService } from '../AuthService';
import { UserRepository } from '../../../Infrastructure/Repositories/UserRepository';
import { User } from '../../../Domain/Entities/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('../../../Infrastructure/Repositories/UserRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        authService = new AuthService(mockUserRepository);
    });

    describe('signUp', () => {
        it('should create a new user and return a token', async () => {
            const mockUser = { id: 1, telegramId: '123', password: 'hashedPassword', token: 'generatedToken' };
            mockUserRepository.create.mockResolvedValue(mockUser as User);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const result = await authService.signUp('123', 'password');

            expect(result).toBe('generatedToken');
            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                telegramId: '123',
                firstName: 'John',
                password: 'hashedPassword',
            }));
        });
    });

    describe('login', () => {
        it('should return a JWT token for valid credentials', async () => {
            const mockUser = { id: 1, telegramId: '123', password: 'hashedPassword', token: 'validToken' };
            mockUserRepository.findByTelegramId.mockResolvedValue(mockUser as User);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

            const result = await authService.login('123', 'password', 'validToken');

            expect(result).toBe('jwtToken');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 1, telegramId: '123' }, expect.any(String), { expiresIn: '1d' });
        });

        it('should return null for invalid credentials', async () => {
            mockUserRepository.findByTelegramId.mockResolvedValue(null);

            const result = await authService.login('123', 'password', 'token');

            expect(result).toBeNull();
        });
    });
});