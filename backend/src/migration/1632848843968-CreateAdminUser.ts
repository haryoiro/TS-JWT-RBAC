import { User } from "../entity/User";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs"

export class CreateAdminUser1632848843968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id", "username", "email"))`);
        let user = new User();
        user.username = "admin";
        user.email = "admin@example.com"
        user.passwordHash = bcrypt.hashSync('admin', 8)
        user.role = "Admin";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
