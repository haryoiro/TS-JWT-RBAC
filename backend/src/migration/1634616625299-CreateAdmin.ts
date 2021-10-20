import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import * as bcrypt from "bcryptjs"
import { RoleList, User } from "../entity/User";

export class CreateAdmin1634616625299 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = getRepository(User);
        let user = new User("admina", "admin@example.com");
        user.passwordHash = bcrypt.hashSync('adminadmin', 8)
        user.role = RoleList.Admin
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
