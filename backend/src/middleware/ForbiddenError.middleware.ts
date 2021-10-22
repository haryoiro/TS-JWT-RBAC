import { HttpError } from 'routing-controllers';
import { IResponse } from 'controllers/types/IResponse';
import { NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
@Middleware({ type: 'after' })
export class ForbiddenErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: IResponse, next: NextFunction) {
        let status = 0
        let name = ""
        if (error?.isBoom) {
            status = error.output.payload.statusCode
            name = error.output.payload.error
        } else {
            status = error.httpCode
            name = error.name
        }

        response.status(status).send({
            statusCode: status,
            error: name,
            message: error.message,
        })
        next()
    }
}

@Middleware({ type: 'after' })
export class BadRequestErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: IResponse, next: NextFunction) {
        return response.boom.badRequest(error.message)
        next();
    }
}