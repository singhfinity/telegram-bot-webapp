import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    telegramId!: string;

    @Column()
    password!: string;

    @Column()
    token!: string;

    @Column()
    createdAt!: Date;
}