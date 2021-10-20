import * as dotenv from "dotenv"
dotenv.config()

const {
    PORT,
    HOST,
    ACCESS_PRIVATE_KEY,
    ACCESS_PUBLIC_KEY,
    ACCESS_TOKEN_DURATION,
    ACCESS_TOKEN_DURATION_UNIT,
    REFRESH_PRIVATE_KEY,
    REFRESH_PUBLIC_KEY,
    REFRESH_TOKEN_DURATION,
    REFRESH_TOKEN_DURATION_UNIT,
    ISSUER,
} = process.env

export const env = {
    PORT:   Number(PORT),
    HOST:   String(HOST),
    ACCESS_PRIVATE_KEY:             ACCESS_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    ACCESS_PUBLIC_KEY:              ACCESS_PUBLIC_KEY.replace(/\\n/gm, '\n'),
    ACCESS_TOKEN_DURATION:          Number(ACCESS_TOKEN_DURATION),
    ACCESS_TOKEN_DURATION_UNIT:     ACCESS_TOKEN_DURATION_UNIT,
    REFRESH_PRIVATE_KEY:            REFRESH_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    REFRESH_PUBLIC_KEY:             REFRESH_PUBLIC_KEY.replace(/\\n/gm, '\n'),
    REFRESH_TOKEN_DURATION:         Number(REFRESH_TOKEN_DURATION),
    REFRESH_TOKEN_DURATION_UNIT:    REFRESH_TOKEN_DURATION_UNIT,
    ISSUER:                         ISSUER,
}