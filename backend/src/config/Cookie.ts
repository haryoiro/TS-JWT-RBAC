import { CookieOptions } from "express"

export function secureCookie(value?: Record<string, unknown>): CookieOptions {
    return {
        ...value,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
}