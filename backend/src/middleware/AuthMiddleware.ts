import { badImplementation } from '@hapi/boom';
import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { RoleList, User } from "../entity/User";
import { IResponse } from "../controllers/types/IResponse";
import { env } from "../config/Environment"
import { AuthService } from '../service/Auth.service';

export const GuardRole = (roles: Array<RoleList>) => {
  return async (res: IResponse, req: Request, next: NextFunction) => {
    const userRepository = await getRepository(User)
    console.log(roles,"role",res.jwt)
    // const id = await res.locals.jwt.sub
    // const user = await userRepository.findOne({where: { id }})
    // if (!user) res.boom.forbidden("userisnotfound")
    // console.log(roles, user.role)


    // console.log(user.role, roles)
    // if (Math.min(...roles) <= user.role) {
    //   next()
    // }

    // res.boom.forbidden("このページにアクセスするための権限がありません。")
    next()
  };
};


export const GuardJwt = async (req: Request, res: IResponse, next: NextFunction) => {
  try {
    const token = await req.headers.authorization.split(' ')[1];
    const payload = await AuthService.verifyAccessToken(token)
    res.jwt = payload
    next()
  } catch (e) {
    switch (e.data) {
      case "jwt expired":
        return res.boom.unauthorized(e.data)
      case "jwt malformed":
      case 'jwt signature is required':
      case 'invalid signature':
      case 'jwt audience invalid.':
      case 'jwt issuer invalid.':
        return res.boom.badRequest("不正なトークンです。")
    }
  }
}

export const GuardRefresh = async (req: Request, res: IResponse, next: NextFunction) => {
  console.log("cookie",req.cookies)
  next()
}