import {
  Body,
  Post,
  JsonController,
  ForbiddenError,
  BadRequestError,
  Res,
  UseBefore,
  Get,
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

  @Get("/login")
  async loginin() {
    return { "message": "messageeee"}
  }

  @Post("/signup")
  async signup(@Body() body: any) {
    const { email, username, password } = body
    const user = await new User()
    user.username = username
    user.email = email
    user.role = "User"
    await user.setHashPassword(password)
    
    const errors = await validate(user)
    if (errors.length > 0) {
      throw new BadRequestError()
    }

    await this.userRepository.save(user)

    const userRepository = await getRepository(User);
    const savedUser = await userRepository
      .save(user)
      .catch(() => { throw new ConflictError("Username or Email is already in use") })

    const token = await savedUser.generateToken()
    return { token }
  }

  @Post("/login")
  async login(@Body() body: any) {
    let { username, email, password } = body
    if (!(username || email) && password) throw new BadRequestError("username or password is required.")

    const user = await this.userRepository.createQueryBuilder("user")
      .where("user.username = :username", { username })
      .orWhere("user.email = :email", { email })
      .getOneOrFail()
    console.log(user)

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