import { RoleList, User } from "../entity/User";
import * as faker from "faker"
import * as bcrypt from "bcryptjs"
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";

export class FakeUsers1634780285446 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const repository = await getRepository(User)

        for(let i = 0; i < 100; i++) {
            const newUser = new User(faker.internet.userName(), faker.internet.email(
                faker.name.firstName(), faker.name.lastName(), "example.com"
            ))
            newUser.passwordHash = await bcrypt.hashSync(faker.internet.password(8), 8)
            newUser.role = RoleList.User
            newUser.isActive = true
            await repository.save(newUser)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
