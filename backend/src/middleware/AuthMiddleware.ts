import { Request, Response, NextFunction } from "express";
import { getManager, getRepository } from "typeorm";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';
import * as config from 'config';
import * as jwt from "jsonwebtoken";

import { RoleList, User } from "../entity/User";

const secret: string = config.get("express.jwtSecret")

export const checkRole = (roles: Array<RoleList>) => {
  return async (res: Response, next: NextFunction) => {
    const userRepository = await getRepository(User)

    const id = await res.locals.jwtPayload.userId;
    const user: User = await userRepository.findOneOrFail(id);

    if (!user) return res.status(StatusCodes.NOT_FOUND)
      .send({
        success: false,
        error: ReasonPhrases.NOT_FOUND,
        message: "ユーザがみつかりませんでした。"
      })
    // Accepted role user
    if (roles.indexOf(user.role) > -1) next();

    return res
      .status(StatusCodes.FORBIDDEN)
      .send({
        success: false,
        error: ReasonPhrases.FORBIDDEN,
        message: "このページにアクセスするための権限がありません。"
      })
  };
};


export const checkJwt = (req: Request, res: Response, next: NextFunction) => {

  try {
    const token = <string>req.headers["authorization"].split(' ')[1];
    let jwtPayload = <any>jwt.verify(token, secret, {
      algorithms: ["HS256"]
    });
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
  }

  next()
}
