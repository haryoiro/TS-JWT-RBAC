import { Response } from 'express';
import api from "./index"
import * as validator from 'validator'
import axios, { AxiosError, AxiosResponse } from "axios";
const { isEmail, isJWT } = validator.default

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
export const authHeader = () => {
  const token = window.localStorage.getItem("token")

  if (token) {
    return { Authorization: token }
  } else {
    return {}
  }
}

class AuthService {
  setToken(newToken: string) {
    const token = `Bearer ${newToken}`
    if (window.localStorage) {
      window.localStorage.setItem("token", token)
    }
  }

  async login(content: ILoginRequest) {
    try {
      const response: AxiosResponse<any> = await api.post("/auth/login", content)
      console.log(response)
      const token = await response.data.data.token
      await this.setToken(JSON.stringify(token))
      return token
    } catch (e) {
      console.log(e.message)
    }
  }

  logout() {
    window.localStorage.removeItem("token")
  }

  async register(content: IRegisterRequest) {
    try {
      const response: AxiosResponse<ITokenResponse> = await api.post("/auth/register", content)
      console.log(response)
      if (response.status === 200) return response.data
    } catch (e) {
      console.log(e.response)
      return e.response
    }
  }
}
export enum RoleList {
  Admin,
  Moderator,
  User,
}

export default new AuthService
