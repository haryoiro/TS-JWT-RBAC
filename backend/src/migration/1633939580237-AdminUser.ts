import {getRepository, MigrationInterface, QueryRunner} from "typeorm"
import * as bcrypt from "bcryptjs"
import { RoleList, User } from "../entity/User";

export class AdminUser1633939580237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = getRepository(User);
        let user = new User();
        user.username = "admina";
        user.email = "admin@example.com"
        user.passwordHash = bcrypt.hashSync('adminadmin', 8)
        user.role = RoleList.Admin
        user.verified = true
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
