import { TelegramBotService } from '../TelegramBotService';
import { UserRepository } from '../../../Infrastructure/Repositories/UserRepository';
import TelegramBot from 'node-telegram-bot-api';

jest.mock('node-telegram-bot-api');
jest.mock('../../../Infrastructure/Repositories/UserRepository');

describe('TelegramBotService', () => {
    let telegramBotService: TelegramBotService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockBot: jest.Mocked<TelegramBot>;

    beforeEach(() => {
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        mockBot = new TelegramBot('') as jest.Mocked<TelegramBot>;
        (TelegramBot as jest.Mock).mockImplementation(() => mockBot);

        telegramBotService = new TelegramBotService('fake-token');
    });

    describe('handleStart', () => {
        it('should create a new user and send welcome message', async () => {
            const msg = { chat: { id: 123 }, from: { first_name: 'John' } };
            await (telegramBotService as any).handleStart(msg);

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                telegramId: '123',
                firstName: 'John',
            }));
            expect(mockBot.sendMessage).toHaveBeenCalledWith(123, expect.any(String), expect.any(Object));
        });
    });

    describe('handleAdminHello', () => {
        it('should send message to user if sender is admin', async () => {
            process.env.ADMIN_IDS = '123,456';
            const msg = { from: { id: 123 }, chat: { id: 789 } };
            const match = ['', '456', 'Hello, user!'];

            await (telegramBotService as any).handleAdminHello(msg, match);

            expect(mockBot.sendMessage).toHaveBeenCalledWith('456', 'Hello, user!');
            expect(mockBot.sendMessage).toHaveBeenCalledWith(789, expect.stringContaining('Message sent to user 456'));
        });

        it('should not send message if sender is not admin', async () => {
            process.env.ADMIN_IDS = '123,456';
            const msg = { from: { id: 789 }, chat: { id: 789 } };
            const match = ['', '456', 'Hello, user!'];

            await (telegramBotService as any).handleAdminHello(msg, match);

            expect(mockBot.sendMessage).toHaveBeenCalledWith(789, expect.stringContaining('not authorized'));
            expect(mockBot.sendMessage).not.toHaveBeenCalledWith('456', expect.any(String));
        });
    });
});