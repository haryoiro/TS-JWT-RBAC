import { RoleList, User } from "../entity/User";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs"

export class CreateAdminUser1633835194461 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let user = new User();
        user.username = "admin";
        user.email = "admin@example.com"
        user.passwordHash = bcrypt.hashSync('admin', 8)
        user.verified = true
        user.role = RoleList.Admin;
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
