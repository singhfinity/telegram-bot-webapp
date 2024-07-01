import { User } from '../User';

describe('User Entity', () => {
    it('should create a user with correct properties', () => {
        const user = new User();
        user.telegramId = '123456';
        user.password = 'password123';
        user.token = 'token123';
        user.createdAt = new Date('2023-05-15');

        expect(user.telegramId).toBe('123456');
        expect(user.password).toBe('password123');
        expect(user.token).toBe('token123');
        expect(user.createdAt).toEqual(new Date('2023-05-15'));
    });
});