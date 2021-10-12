import { randomBytes } from 'crypto';
import { RefreshToken } from '../entity/RefreshToken';
import { Repository, EntityRepository } from 'typeorm';
import * as Dayjs from 'dayjs';
import { User } from '../entity/User';

const REFRESH_TOKEN_DURATION = 30
const REFRESH_TOKEN_UNIT = "days"


@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {

    constructor() {
        super();
    }

    /**
     * @description Generate a new refresh token
     *
     * @param user
     */
    generate(user: User): RefreshToken {
        const token = `${user.id}.${randomBytes(40).toString('hex')}`;
        const expires = Dayjs().add(REFRESH_TOKEN_DURATION, REFRESH_TOKEN_UNIT).toDate();
        return new RefreshToken(token, user, expires)
    }
}