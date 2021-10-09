import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { ConflictError } from 'common/Errors/Conflict';
import { logger } from "../common/Logging"

@Middleware({ type: 'after' })
export class errorHandleMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: ConflictError, request: any, response: any, next: (err: any) => any) {
    logger.info(`${error.httpCode} ${error.operationName}`)
    next("")
  }
}