import { Response } from "express"

export interface IResponse extends Response {
    boom: Express.Boom
    locals: {
        data?: Record<string, unknown> | Record<string, unknown>[],
        jwtPayload?: {
            userId: string,
        },
        meta?: {
            total: number,
            pagination?: {
                current?: number,
                next?: number,
                prev?: number,
            }
        }
    }
}