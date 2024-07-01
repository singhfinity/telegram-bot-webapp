import { AuthController } from '../AuthController';
import { AuthService } from '../../../Application/Services/AuthService';
import { UserRepository } from '../../../Infrastructure/Repositories/UserRepository';
import { Request, Response } from 'express';

jest.mock('../../../Application/Services/AuthService');
jest.mock('../../../Infrastructure/Repositories/UserRepository');

describe('AuthController', () => {
    let authController: AuthController;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        (UserRepository as jest.Mock).mockImplementation(() => mockUserRepository);

        mockAuthService = new AuthService(mockUserRepository) as jest.Mocked<AuthService>;
        (AuthService as jest.Mock).mockImplementation(() => mockAuthService);

        authController = new AuthController(mockUserRepository, mockAuthService);

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('signUp', () => {
        it('should return a token on successful signup', async () => {
            mockRequest.body = { telegramId: '123', firstName: 'John', password: 'password' };
            mockAuthService.signUp.mockResolvedValue('generatedToken');

            await authController.signUp(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ token: 'generatedToken' });
        });

        it('should return an error on signup failure', async () => {
            mockRequest.body = { telegramId: '123', firstName: 'John', password: 'password' };
            mockAuthService.signUp.mockRejectedValue(new Error('Signup failed'));

            await authController.signUp(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sign up failed' });
        });
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
            mockRequest.body = { telegramId: '123', password: 'password', token: 'validToken' };
            mockAuthService.login.mockResolvedValue('jwtToken');

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith({ token: 'jwtToken' });
        });

        it('should return an error on invalid credentials', async () => {
            mockRequest.body = { telegramId: '123', password: 'password', token: 'invalidToken' };
            mockAuthService.login.mockResolvedValue(null);

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });
    });
});