import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import  * as boom from "@hapi/boom"
import { logger } from "../common/Logging"

export const errorHandleMiddleware = (request: any, response: any, next: () => any) => {
  // logger.info(`${error.httpCode}`)
  if (response.boom) throw new Error("boom already exists on response object")
  console.log("eroo")
  response.boom = {};
  Object.getOwnPropertyNames(boom).forEach((key) => {
    console.log(!!boom[key])
    if (typeof boom[key] !== "function") return
    if (response.boom[key]) {
      response.boom[key]()
    }
  })
  next()
}
