import { getCustomRepository, getRepository, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './../entity/RefreshToken';
import { badData, badImplementation, badRequest, Boom, unauthorized } from "@hapi/boom";
import { User } from "../entity/User";
import * as Dayjs from 'dayjs';
import { JwtPayload, sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { env } from '../config/Environment';

class JwtOption {
    static signAccess = (val?): SignOptions => {return {
        ...val,
        "expiresIn": env.ACCESS_TOKEN_DURATION+env.ACCESS_TOKEN_DURATION_UNIT,
        "algorithm": "ES256",
    }}
    static verifyAccess = (val?): VerifyOptions => {return {
        ...val,
        "expiresIn": env.ACCESS_TOKEN_DURATION+env.ACCESS_TOKEN_DURATION_UNIT,
        "algorithms": ["ES256"]
    }}
    static signRefresh = (val?): SignOptions => {return {
        ...val,
        "expiresIn": env.REFRESH_TOKEN_DURATION + env.REFRESH_TOKEN_DURATION_UNIT,
        "algorithm": "ES256"
    }}
    static verifyRefresh = (val?): VerifyOptions => {return {
        ...val,
        "expiresIn": env.REFRESH_TOKEN_DURATION + env.REFRESH_TOKEN_DURATION_UNIT,
        "algorithms": ["ES256"]
    }}
}

class AuthService {

    private static instance: AuthService;

    private constructor() { }

    static get() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    async generateTokenResponse(user: User): Promise<{
        accessToken: string,
        refreshToken: string,
    }> {
        try {
            if (!user || !(user instanceof User) || !user.id) {
                throw badData('User is not an instance of User')
            }
            // リフレッシュトークンがあれば削除
            await this.revokeRefreshToken(user)
            const refreshToken = await this.signRefreshToken(user)
            const accessToken = await this.signAccessToken(user)
            if (typeof accessToken !== "string" || typeof refreshToken !== "string")
                throw badRequest("generate token error")

            return { accessToken, refreshToken };
        } catch (e) {
            throw badImplementation("generateTokenResponse", e.messages)
        }
    }

    async signAccessToken(user: User): Promise<string | Boom<unknown>> {
        try {
            if (!user || !(user instanceof User) || !user.id) {
                return badData('User は Userインスタンスではありません')
            }
            const payload: JwtPayload = { user: { id: user.id, username: user.username, role: user.role } }
            const token = await sign(
                payload,
                env.ACCESS_PRIVATE_KEY,
                JwtOption.signAccess()
            );
            return token
        } catch (e) {
            throw e
        }
    }

    async verifyAccessToken(accessToken) {
        try {
            const token = await verify(accessToken, env.ACCESS_PUBLIC_KEY, JwtOption.verifyAccess())
            return token
        } catch(e) {
            throw e
        }
    }

    async signRefreshToken(user: User): Promise<string | Boom<unknown>> {
        try {
            if (!user || !(user instanceof User) || !user.id) {
                return badData('User は Userインスタンスではありません')
            }
            const payload: JwtPayload = {
                username: user.username,
                id: user.id,
            }

            const expires: Date = Dayjs().add( env.REFRESH_TOKEN_DURATION, env.REFRESH_TOKEN_DURATION_UNIT ).toDate()
            const jwtid = uuidv4()
            const token = await sign( payload, env.REFRESH_PRIVATE_KEY, JwtOption.signRefresh({ jwtid }) );

            const newRefreshToken = await new RefreshToken(token, user, expires, jwtid)
            await getRepository(RefreshToken).save(newRefreshToken)
            return token
        } catch (e){
            return e
        }
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            const payload = verify( refreshToken, env.REFRESH_PUBLIC_KEY, JwtOption.verifyRefresh()
            ) as JwtPayload
            return payload
        } catch (e) {
            return e
        }
    }

    async verifyAndSignRefreshToken(refreshToken: string) {
        try {
            // サーバにあるトークンとヘッダに含まれるトークンを比較する。
            const oldRefreshToken = await getRepository(RefreshToken).findOne({ where: { token: refreshToken } })
            if (
                !oldRefreshToken
                || oldRefreshToken.token !== refreshToken
            ) {
                throw unauthorized("invalid token")
            }

            // verify token
            const payload = await verify( refreshToken, env.REFRESH_PUBLIC_KEY, JwtOption.verifyRefresh() ) as JwtPayload

            const user = await getRepository(User).findOne({ where: { id: payload.id} })
            if (!user ||  !user.id) {
                return "ユーザが見つかりません。"
            }

            await this.revokeRefreshToken(user)
            delete payload.iat
            delete payload.exp
            delete payload.nbf
            delete payload.jti
            const expires = oldRefreshToken.expires
            const jwtid = uuidv4()
            const token = await sign(payload, env.REFRESH_PRIVATE_KEY, JwtOption.signRefresh({ jwtid }))

            const newRefreshToken: RefreshToken = await new RefreshToken(token, user, expires, jwtid)

            await getRepository(RefreshToken).save(newRefreshToken)

            return newRefreshToken
        } catch (e) {
            return e
        }
    }

    async revokeRefreshToken(user: User) {
        if (!user || !(user instanceof User) || !user.id) {
            return badData('User は Userインスタンスではありません')
        }
        const oldToken = await getRepository(RefreshToken).findOne({ where: { user } })
        if (oldToken) { await getRepository(RefreshToken).remove(oldToken) }
    }
}


const authService = AuthService.get();

export { authService as AuthService }
