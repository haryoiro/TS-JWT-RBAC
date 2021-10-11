import {MigrationInterface, QueryRunner} from "typeorm";

export class Role1633860047724 implements MigrationInterface {
    name = 'Role1633860047724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt") SELECT "id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
        await queryRunner.query(`CREATE TABLE "Role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL, "passwordHash" varchar NOT NULL, "role" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt") SELECT "id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "User"("id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt") SELECT "id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
        await queryRunner.query(`DROP TABLE "Role"`);
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`INSERT INTO "User"("id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt") SELECT "id", "username", "email", "verified", "passwordHash", "role", "createdAt", "updatedAt" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
    }

}
