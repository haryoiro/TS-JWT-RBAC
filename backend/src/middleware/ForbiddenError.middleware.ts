import { IResponse } from 'controllers/types/IResponse';
import { NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ForbiddenErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: IResponse, next: NextFunction) {
        return response.boom.forbidden(error)
        next();
    }
}

@Middleware({ type: 'after' })
export class BadRequestErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: IResponse, next: NextFunction) {
        return response.boom.badRequest(error)
        next();
    }
}