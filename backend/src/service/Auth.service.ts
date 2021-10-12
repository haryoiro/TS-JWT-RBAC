import { getCustomRepository, getRepository } from 'typeorm';
import { RefreshToken } from './../entity/RefreshToken';
import { badData } from "@hapi/boom";
import { User } from "../entity/User";
import { RefreshTokenRepository } from '../repositories/RefreshToken.repository';
import * as Dayjs from 'dayjs';

const ACCESS_TOKEN_DURATION = 120960

class AuthService {

    private static instance: AuthService;

    private constructor() { }

    static get() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    async generateTokenResponse(user: User, accessToken: String) {
        try {
            if (!user || !(user instanceof User) || !user.id) {
                throw badData('User is not an instance of User')
            }
            if (!accessToken) {
                throw badData('Access token cannnot be retrieved')
            }

            const oldToken = await getRepository(RefreshToken).findOne({ where: { user } })
            if (oldToken) await getRepository(RefreshToken).remove(oldToken)
            const refreshToken = getCustomRepository(RefreshTokenRepository).generate(user).token
            const expiresIn = Dayjs().add(ACCESS_TOKEN_DURATION, 'minutes').unix();
            return { accessToken, refreshToken, expiresIn };
        } catch (e) {
            console.log("gento", e)
        }
    }

    async revokeRefreshToken(user: User) {
        if (!user || !(user instanceof User) || !user.id) {
            return badData('User は Userインスタンスではありません')
        }

        const oldToken = await getRepository(RefreshToken).findOne({ where: { user } })

        if (oldToken) {
            await getRepository(RefreshToken).remove(oldToken)
        }
    }

    async jwt(payload: { sub }, next: (e?: Error, v?: User | boolean) => void) {
        try {
            const user = await getRepository(User).findOne(payload.sub)
            if (user) {
                return next(null, user)
            }
            return next(null, false)
        } catch (error) {
            return next(error, false)
        }
    }
}


const authService = AuthService.get();

export { authService as AuthService }
