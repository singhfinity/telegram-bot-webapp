import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1719838994603 implements MigrationInterface {
    name = 'InitialMigration1719838994603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "telegramId" character varying NOT NULL, "password" character varying NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5" UNIQUE ("telegramId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
