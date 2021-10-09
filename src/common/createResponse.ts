export interface IResponse {
  status: number
  message: string | Object | ""
}
export const resjson = (status, message): IResponse => {
  return {
    status,
    message
  }
}