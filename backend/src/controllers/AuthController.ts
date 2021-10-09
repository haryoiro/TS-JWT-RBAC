import {
  Body,
  Post,
  JsonController,
  ForbiddenError,
  BadRequestError,
  Res,
  UseBefore,
  Get,
  Patch,
} from "routing-controllers";
import { Response } from "express";
import { getRepository, Repository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { checkJwt } from "../middleware/AuthMiddleware";
import { resjson } from "../common/createResponse";

@JsonController("/auth")
export class AuthController {
  userRepository: Repository<User> = getRepository(User);

  @Post("/signup")
  async signup(@Res() res: Response,@Body() body: any) {
    const { email, username, password } = body

    if (!(email && username) || !password) {
      return new BadRequestError("not enough parameters")
    }
    // if (this.userRepository.find({ email }) ||
    //   this.userRepository.find({ username })) {
    //   throw new ConflictError("Username or Email is already in use")
    // }

    const user = await new User()
    user.username = username || ""
    user.email = email || ""
    user.role = "User"
    await user.setHashPassword(password)
  
    const errors = await validate(user)
    if (errors.length > 0) {
      return new BadRequestError("validation error")
    }

    await this.userRepository.save(user)
    return resjson(200, "User is created")
  }

  @Post("/login")
  async login(@Body() body: any) {
    let { username, email, password } = body
    if (!(username || email) && password) return new BadRequestError("username or password is required.")

    const user = await this.userRepository.createQueryBuilder("User")
      .where("user.username = :username", { username })
      .orWhere("user.email = :email", { email })
      .getOneOrFail()

    if (!user.checkPasswordIsValid(password))
      return new ForbiddenError()

    const token = await user.generateToken()
    return { token }
  }

  @Patch("/change-password")
  @UseBefore(checkJwt)
  async changePassword(@Res() response: Response, @Body() body: any) {
    const { oldPassword, newPassword } = body
    if (!(oldPassword, newPassword))
      return new BadRequestError()

    const id = response.locals.jwtPayload.userId
    const user = await this.userRepository
      .findOneOrFail(id)
      .catch(() => { throw new BadRequestError() })

    if (!user.checkPasswordIsValid(oldPassword))
      return new ForbiddenError()

    user.setHashPassword(newPassword)

    const errors = await validate(user)
    if (errors.length > 0)
      return new BadRequestError()

    this.userRepository.save(user)
  }
}