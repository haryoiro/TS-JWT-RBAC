import { Request, Response, NextFunction } from "express";
import { getManager, getRepository } from "typeorm";
import * as config from 'config';
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";

const secret: string = config.get("express.jwtSecret")

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = await res.locals.jwtPayload.userId;

    const userRepository = await getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      return res.status(401).send();
    }

    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};


export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["authorization"].split(' ')[1];
  let jwtPayload;
  try {
    jwtPayload = <any>jwt.verify(token, secret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
  }
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, secret, {
    expiresIn: "1h"
  });

  next()
}
