import { Response } from "express"
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export interface IResponseOption {
  error: boolean
  code: StatusCodes
  message: string
}
export interface IResponseProps<T> {
  option: IResponseOption
  data?: T
}

export const createResponse = (response: Response) =>
<T>(error = false, code = 200, message = "OK", data: T): Response => {
  return response.status(code).send({
    error,
    code,
    message,
    data: data && data,
  })
}
function error (res, data): Response;
function error (res, code, message, data)
function error (res, code?, message?, data?) {
  return createResponse(res)(
    true,
    code = code ? code : StatusCodes.BAD_REQUEST,
    message = message ? message : ReasonPhrases.BAD_REQUEST,
    data
  )
}

function success (res, data): Response;
function success (res, code, message, data)
function success (res, code?, message?, data?) {
  return createResponse(res)(
    false,
    code = code ? code : StatusCodes.OK,
    message = message ? message : ReasonPhrases.OK,
    data = data ? data : ""
  )
}
export { success, error }