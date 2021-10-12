import { User } from "../entity/User";
import { omitBy, isNil } from 'lodash';
import { Entity, EntityRepository, getRepository, Repository } from "typeorm";
import { badRequest, notFound, unauthorized } from "@hapi/boom";
import * as Dayjs from "dayjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor(){ super() }

    async one(id: number) {
        const options: { id: number } = omitBy({ id }, isNil) as { id: number };
        const user = await getRepository(User).findOne({ where: options })

        if (!user) {
            throw notFound('User not found')
        }

        return user
    }

    async findAndGenerateToken(options) {

        const { email, password, refreshToken } = options

        if (!email) {
            throw badRequest("")
        }

        const user = await this.findOne({ where: email })
        if (!user) {
            throw notFound("User not found")
        } else if (password && await user.checkPasswordIsValid(password) === false) {
            throw unauthorized("不正なパスワードです。")
        } else if (refreshToken && refreshToken.user.email === email && Dayjs(refreshToken.expires).isBefore( Dayjs() )) {
            throw unauthorized("Invalid refresh token")
        }

        return { user, accessToken: user.token() }
    }
}