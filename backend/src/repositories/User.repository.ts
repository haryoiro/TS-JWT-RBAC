import { SORT_USER_FIELD, TSortUserField, TSortOrder } from './../types/types';
import { User } from "../entity/User";
import { Entity, EntityRepository, getRepository, Repository } from "typeorm";
import { badRequest, notFound, unauthorized } from "@hapi/boom";
import * as Dayjs from "dayjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor() { super() }

    async all(page, take, sortField: TSortUserField, sortOrder: TSortOrder) {
        const users = getRepository(User).find({
            cache: true,
            select: [...SORT_USER_FIELD],
            skip: take * page,
            take,
            order: {
                [sortField]: sortOrder,
            }
        })

        if (!users) {
            throw notFound('User not found')
        }

        return users
    }

    async one(id: string) {
        const user = await getRepository(User).findOne({
            where: { id },
            select: [...SORT_USER_FIELD, "passwordHash"]
        })

        if (!user) {
            throw notFound('User not found')
        }

        return user
    }
}