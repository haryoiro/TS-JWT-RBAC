import {
  Body,
  Post,
  JsonController,
  ForbiddenError,
  BadRequestError,
  Res,
  UseBefore,
} from "routing-controllers";
import { Response } from "express";
import { getRepository, Repository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { checkJwt } from "../middleware/AuthMiddleware";
import { ConflictError } from "../common/Errors/Conflict";

@JsonController()
export class AurhController {
  userRepository: Repository<User> = getRepository(User);

  @Post("/signup")
  async signup(@Body() body: any) {
    const { email, username, password } = body
    const user = new User()
    user.username = username
    user.email = email
    user.setHashPassword(password)
    user.role = "User"

    const errors = await validate(user)
    if (errors.length > 0) {
      throw new BadRequestError()
    }

    await this.userRepository.save(user)

    const userRepository = getRepository(User);
    const savedUser = await userRepository
      .save(user)
      .catch(() => { throw new ConflictError("Username or Email is already in use") })
    
    const token = savedUser.generateToken()
    return { token }
  }

  @Post("/login")
  async login(@Body() body: any) {
    let { username, password } = body
    if (!(username, password)) throw new BadRequestError("username or password is required.")

    const user = await this.userRepository.findOneOrFail({ where: { username } });

    if (!user.checkPasswordIsValid(password))
      throw new ForbiddenError()
  
    const token = await user.generateToken()
    return { token }
  }

  @Post("/change-password")
  @UseBefore(checkJwt)
  async changePassword(@Res() response: Response, @Body() body: any) {
    const { oldPassword, newPassword } = body
    if (!(oldPassword, newPassword))
      throw new BadRequestError()

    const id = response.locals.jwtPayload.userId
    const user = await this.userRepository
      .findOneOrFail(id)
      .catch(() => { throw new BadRequestError() })
    
    if (!user.checkPasswordIsValid(oldPassword))
      throw new ForbiddenError()

    user.setHashPassword(newPassword)

    const errors = await validate(user)
    if (errors.length > 0)
      throw new BadRequestError()

    this.userRepository.save(user)
  }
}