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
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';
import { Response } from "express";
import { getRepository, Repository } from "typeorm";
import { validate } from "class-validator";

import { RoleList, User } from "../entity/User";
import { checkJwt } from "../middleware/AuthMiddleware";
import { ConflictError } from "../common/Errors/Conflict";

@JsonController("/auth")
export class AuthController {
  userRepository: Repository<User> = getRepository(User);

  @Post("/register")
  async register(@Res() res: Response, @Body() body: any) {
    const { email, username, password } = body

    if (!(email && username) || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({
          success: false,
          error: ReasonPhrases.BAD_REQUEST,
          message: "ユーザ名かメールアドレスが不正です。"
        })
    }
    
    if (await this.userRepository.findOne({ email }) ||
      await this.userRepository.findOne({ username })) {
      return res
        .status(StatusCodes.CONFLICT)
        .send({
          success: false,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          message: "ユーザ名またはメールアドレスがすでに使用されています。"
        })
    }

    const user = await new User()
    user.username = username || ""
    user.email = email || ""
    user.verified = false
    user.role = RoleList.User
    await user.setHashPassword(password)
  
    // ユーザエンティティで定義されたバリデーションを実行
    const errors = await validate(user)
    if (errors.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({
          error: "Validation Error",
          message: errors
        })
    }

    await this.userRepository.save(user)
    return res
      .status(StatusCodes.CREATED)
      .send({
        success: true,
        error: false,
        message: "User is Created"
      })
  }

  @Post("/login")
  async login(@Res() res: Response,　@Body() body: any) {
    try {
      let { username, password } = body
      if (!username && password)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({
            success: false,
            error: getReasonPhrase(StatusCodes.CONFLICT),
            message: "ユーザ名またはパスワードが不正です。"
          })

      const user = await this.userRepository.findOne({ username })
      if (!user)
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({
            success: false,
            error: ReasonPhrases.NOT_FOUND,
            message: "ユーザがみつかりません。"
          })

      if (!(await user.checkPasswordIsValid(password)))
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({
            success: false,
            error: ReasonPhrases.BAD_REQUEST,
            message: "ユーザ名またはパスワードが不正です。"
          })

      const token = await user.generateToken()
      console.log(token)
      return { token }
    } catch (e) {
      console.log(e)
    }
  }

  @Patch("/change-password")
  @UseBefore(checkJwt)
  async changePassword(@Res() res: Response, @Body() body: any) {
    const { oldPassword, newPassword } = body
    if (!(oldPassword, newPassword))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({
          success: false,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          message: "ユーザ名またはパスワードが不正です。"
        })

    const id = res.locals.jwtPayload.userId
    const user = await this.userRepository.findOne(id)
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({
          success: false,
          error: ReasonPhrases.NOT_FOUND,
          message: "ユーザがみつかりません。"
        })

    if (!user.checkPasswordIsValid(oldPassword))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({
          success: false,
          error: ReasonPhrases.BAD_REQUEST,
          message: "ユーザ名またはパスワードが不正です。"
        })

    await user.setHashPassword(newPassword)

    const errors = await validate(user)
    if (errors.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({
          error: "Validation Error",
          message: errors
        })
    }
  
    this.userRepository.save(user)
  }
}