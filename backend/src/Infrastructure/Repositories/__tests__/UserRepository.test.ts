import { UserRepository } from '../UserRepository';
import { User } from '../../../Domain/Entities/User';
import { Repository } from 'typeorm';

jest.mock('typeorm', () => ({
    getRepository: jest.fn(),
}));

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockTypeormRepository: jest.Mocked<Repository<User>>;

    beforeEach(() => {
        mockTypeormRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<User>>;

        (require('typeorm').getRepository as jest.Mock).mockReturnValue(mockTypeormRepository);

        userRepository = new UserRepository();
    });

    describe('findByTelegramId', () => {
        it('should return a user when found', async () => {
            const mockUser = { id: 1, telegramId: '123' };
            mockTypeormRepository.findOne.mockResolvedValue(mockUser as User);

            const result = await userRepository.findByTelegramId('123');

            expect(result).toEqual(mockUser);
            expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({ where: { telegramId: '123' } });
        });

        it('should return null when user is not found', async () => {
            mockTypeormRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.findByTelegramId('123');

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create and save a new user', async () => {
            const mockUser = { telegramId: '123' };
            mockTypeormRepository.create.mockReturnValue(mockUser as User);
            mockTypeormRepository.save.mockResolvedValue({ ...mockUser, id: 1 } as User);

            const result = await userRepository.create(mockUser as User);

            expect(result).toEqual({ ...mockUser, id: 1 });
            expect(mockTypeormRepository.create).toHaveBeenCalledWith(mockUser);
            expect(mockTypeormRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });
});