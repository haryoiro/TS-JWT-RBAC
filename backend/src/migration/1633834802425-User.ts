import {MigrationInterface, QueryRunner} from "typeorm";

export class User1633834802425 implements MigrationInterface {
    name = 'User1633834802425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "verified" datetime NOT NULL, PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "verified") SELECT "id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "emailVerifiedAt" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "verified" boolean NOT NULL, PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "verified") SELECT "id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "verified" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "verified" datetime NOT NULL, PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "User"("id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "verified") SELECT "id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "verified" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "emailVerifiedAt" datetime NOT NULL, PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "User"("id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "emailVerifiedAt") SELECT "id", "username", "email", "passwordHash", "role", "createdAt", "updatedAt", "verified" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
    }

}
