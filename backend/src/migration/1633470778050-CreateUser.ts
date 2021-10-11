import { RoleList, User } from "../entity/User";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs"

export class createUser1633470778050 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let user = new User();
        user.username = "user";
        user.email = "user1.example@example.com"
        user.passwordHash = bcrypt.hashSync('user', 8)
        user.role = RoleList.User
        user.verified = false
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
