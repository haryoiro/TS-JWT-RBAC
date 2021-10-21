import api from "./apiAccess"
import axios, { AxiosResponse } from "axios";
import { base64 } from "../helper/base64";

interface ILoginRequest {
  username: string
  password: string
}
interface ITokenResponse {
  token: string
  status: number
}
interface IRegisterRequest {
  username: string
  password: string
  email: string
}
interface IUser {
  id: string,
  username: string,
  role: number
}
interface IPayload extends Object {
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

  async login(content: ILoginRequest) {
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
      if (!user) return
      const response: AxiosResponse<any> = await api.post("/auth/logout", JSON.parse(user))
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
      return response
    } catch(e) {
      console.log("logout", e)
    }
  }

  async register(content: IRegisterRequest): Promise<any> {
    try {
      const response: AxiosResponse<ITokenResponse> = await api.post("/auth/register", content)
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
