import { User } from "../entity/User";
import * as bcrypt from "bcryptjs"
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";

export class CreateAdminUser1633959010437 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = getRepository(User);
        let user = new User("admina", "admin@example.com");
        user.passwordHash = bcrypt.hashSync('adminadmin', 8)
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
