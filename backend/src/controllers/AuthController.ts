import { AuthService } from './../service/Auth.service';
import {
  Body,
  Post,
  JsonController,
  Res,
  UseBefore,
  Patch,
  Req,
} from "routing-controllers";
import { Response } from "express";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { validate } from "class-validator";

import { RoleList, User } from "../entity/User";
import { checkJwt } from "../middleware/AuthMiddleware";
import { badRequest, conflict } from '@hapi/boom';
import { UserRepository } from '../repositories/User.repository';
import { IResponse } from '../types/Response.interface';

@JsonController("/auth")
export class AuthController {
  userRepository: Repository<User> = getRepository(User);

  @Post("/register")
  async register(@Res() res: IResponse, @Body() body: any, next: (e?: Error) => void) {
    try {
      const { email, username, password } = body

      if (!(email && username) || !password) {
        return res.boom.badRequest("不正なリクエスト")
      }

      if (await this.userRepository.findOne({ email })) {
        return res.boom.conflict("Emailはすでに登録されています。")
      } else if (await this.userRepository.findOne({ username })) {
        return res.boom.conflict("ユーザはすでに登録されています。")
      }

      const user = await new User(username, email)
      await user.setHashPassword(password)

      // ユーザエンティティで定義されたバリデーションを実行
      const errors = await validate(user)
      if (errors.length > 0) {
        return res.boom.badRequest("ValidationError", errors)
      }

      await this.userRepository.insert(user)
      const accessToken = await user.token()
      const token = await AuthService.generateTokenResponse(user, accessToken)
      return res.status(201).send({ token, user, message: "ユーザが登録されました", })
    } catch (e) {
      console.log("error", e)
    }
  }

  @Post("/login")
  async login(@Res() res: Response, @Body() body: any) {
    const repository = getCustomRepository(UserRepository);
    const { user, accessToken } = await repository.findAndGenerateToken(body);
    const token = await AuthService.generateTokenResponse(user, await accessToken)
    res.locals.data = { token, user }
  }

  @Post("/logout")
  async logout(@Res() res: IResponse, @Req() req: { user: any }) {
    await AuthService.revokeRefreshToken(req.user)
    res.locals.data = null
  }

  @Patch("/change-password")
  @UseBefore(checkJwt)
  async changePassword(@Res() res: IResponse, @Body() body: any) {
    const { oldPassword, newPassword } = body
    if (!(oldPassword, newPassword))
      return res.boom.conflict("ユーザ名またはパスワードが不正です。")

    const id = res.locals.jwtPayload.userId
    const user = await this.userRepository.findOne(id)
    if (!user)
      return res.boom.badRequest("ユーザがみつかりません。")

    if (!user.checkPasswordIsValid(oldPassword))
      return res.boom.badRequest("ユーザ名またはパスワードが不正です。")

    await user.setHashPassword(newPassword)

    const errors = await validate(user)
    if (errors.length > 0) {
      return res.boom.badRequest("ValidationError", errors)
    }

    this.userRepository.save(user)
  }
}