import {MigrationInterface, QueryRunner} from "typeorm";

export class User1633741647550 implements MigrationInterface {
    name = 'User1633741647550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
