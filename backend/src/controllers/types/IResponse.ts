import { Response,  } from "express"
import { JwtPayload } from 'jsonwebtoken';

export interface IResponse extends Response {
    jwt: string | JwtPayload;
    boom: Express.Boom
    locals: {
        data?: Record<string, unknown> | Record<string, unknown>[],
        jwt?: JwtPayload | string | any
    }
}
type TypedResponse<T> = Omit<Response, 'json'> & { json(data: T): Response, boom: Express.Boom };
// An example of a typed response
type AppResponse = TypedResponse<{
    success: boolean,
    data?: any,
    error?: string,
}>
