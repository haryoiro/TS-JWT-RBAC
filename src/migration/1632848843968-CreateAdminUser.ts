import { User } from "../entity/User";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs"

export class CreateAdminUser1632848843968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_56a26a8f87cbdc4b5ad24e31b40" UNIQUE ("username", "id"))`);
        let user = new User();
        user.username = "admin";
        user.email = "user.example@example.com"
        user.passwordHash = bcrypt.hashSync('admin', 8)
        user.role = "Admin";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
