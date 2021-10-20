import { User } from "../entity/User";
import { omitBy, isNil } from 'lodash';
import { Entity, EntityRepository, getRepository, Repository } from "typeorm";
import { badRequest, notFound, unauthorized } from "@hapi/boom";
import * as Dayjs from "dayjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor() { super() }

    async one(id: number) {
        const options: { id: number } = omitBy({ id }, isNil) as { id: number };
        const user = await getRepository(User).findOne({ where: options })

        if (!user) {
            throw notFound('User not found')
        }

        return user
    }
}