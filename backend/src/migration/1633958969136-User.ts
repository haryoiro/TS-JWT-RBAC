import {MigrationInterface, QueryRunner} from "typeorm";

export class User1633958969136 implements MigrationInterface {
    name = 'User1633958969136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL, "passwordHash" varchar NOT NULL, "role" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
        await queryRunner.query(`CREATE TABLE "RefreshToken" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "expires" datetime NOT NULL, "userId" varchar, "userUsername" varchar, "userEmail" varchar, CONSTRAINT "REL_c7a6026ea323541f93f7fdf97c" UNIQUE ("userId", "userUsername", "userEmail"))`);
        await queryRunner.query(`CREATE TABLE "Role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_RefreshToken" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "expires" datetime NOT NULL, "userId" varchar, "userUsername" varchar, "userEmail" varchar, CONSTRAINT "REL_c7a6026ea323541f93f7fdf97c" UNIQUE ("userId", "userUsername", "userEmail"), CONSTRAINT "FK_c7a6026ea323541f93f7fdf97cc" FOREIGN KEY ("userId", "userUsername", "userEmail") REFERENCES "User" ("id", "username", "email") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_RefreshToken"("id", "token", "expires", "userId", "userUsername", "userEmail") SELECT "id", "token", "expires", "userId", "userUsername", "userEmail" FROM "RefreshToken"`);
        await queryRunner.query(`DROP TABLE "RefreshToken"`);
        await queryRunner.query(`ALTER TABLE "temporary_RefreshToken" RENAME TO "RefreshToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RefreshToken" RENAME TO "temporary_RefreshToken"`);
        await queryRunner.query(`CREATE TABLE "RefreshToken" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "expires" datetime NOT NULL, "userId" varchar, "userUsername" varchar, "userEmail" varchar, CONSTRAINT "REL_c7a6026ea323541f93f7fdf97c" UNIQUE ("userId", "userUsername", "userEmail"))`);
        await queryRunner.query(`INSERT INTO "RefreshToken"("id", "token", "expires", "userId", "userUsername", "userEmail") SELECT "id", "token", "expires", "userId", "userUsername", "userEmail" FROM "temporary_RefreshToken"`);
        await queryRunner.query(`DROP TABLE "temporary_RefreshToken"`);
        await queryRunner.query(`DROP TABLE "Role"`);
        await queryRunner.query(`DROP TABLE "RefreshToken"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
