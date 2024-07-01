import { Repository } from 'typeorm';
import { User } from '../../Domain/Entities/User';
import { AppDataSource } from '../Database/database';

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async findById(id: number): Promise<User | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByTelegramId(telegramId: string): Promise<User | null> {
        return this.repository.findOne({ where: { telegramId } });
    }

    async create(user: Partial<User>): Promise<User> {
        console.log(JSON.stringify(user));
        const newUser = this.repository.create(user);
        return this.repository.save(newUser);
    }
}