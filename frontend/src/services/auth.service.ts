import api from "./apiAccess"
import axios, { AxiosResponse } from "axios";
import { base64 } from "../helper/base64";

export interface ILoginValue {
  username: string
  password: string
}
export interface ITokenResponse {
  token: string
  status: number
}
export interface ISignUpValue {
  username: string
  password: string
  email: string
}
export interface IUser {
  id: string,
  username: string,
  email: string,
  role: number
}
export interface IPayload extends Object {
  iat: Date
  exp: Date
  user: IUser
}

export function genHeader() {
  const token = sessionStorage.get("token")
  return { headers: {
    authorization: `Bearer ${token}`,
  } }
}

class AuthService {

  constructor() { }

  async login(content: ILoginValue) {
    try {
      const response: AxiosResponse<any> = await api.post("/auth/login", content)
      const accessToken = await response.data.token.accessToken
      const payload = await this.payload(accessToken)
      sessionStorage.setItem("token", accessToken)
      sessionStorage.setItem("user", JSON.stringify(payload.user))
      console.log(accessToken)
      return { user: payload.user, token: accessToken }
    } catch (e) {
      console.log("res",e)
    }
  }

  async logout() {
    try {
      const user = window.localStorage.getItem("user")
      console.log(user)
      if (!user) return
      const response: AxiosResponse<any> = await api.post("/auth/logout", JSON.parse(user))
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
      return response
    } catch(e) {
      console.log("logout", e)
    }
  }

  async SignUp(content: ISignUpValue): Promise<any> {
    try {
      const response: AxiosResponse<ITokenResponse> = await api.post("/auth/SignUp", content)
      return response
    } catch (e) {
      return e
    }
  }

  // async refresh() {
  //   try {
  //     const response: AxiosResponse<any> = await api.post("/auth/refresh")
  //   }
  // }

  async payload(token: string):  Promise<IPayload> {
    const payload = await token.split(".")[1]
    const decodedPayload = await base64(payload)
    const data: IPayload = await JSON.parse(decodedPayload)
    return data
  }
}

export enum RoleList {
  Admin,
  Moderator,
  User,
}

export default new AuthService
