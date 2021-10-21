import { badImplementation } from '@hapi/boom';
import { AuthService } from './../service/Auth.service';
import {
  Body,
  Post,
  JsonController,
  Res,
  UseBefore,
  Patch,
  Req,
  OnUndefined,
  Get,
  Authorized,
} from "routing-controllers";
import { Response, Request } from "express";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { validate } from "class-validator";
import { RoleList, User } from "../entity/User";
import { ILoginResponse, IResponse } from './types/IResponse';
import { IRegisterResponse } from './types/IRegisterResponse';
import * as Dayjs from 'dayjs';
import { env } from '../config/Environment';
import { RefreshToken } from 'entity/RefreshToken';
import cors = require('cors');
import { secureCookie } from '../config/Cookie';


@JsonController("/auth")
export class AuthController {
  userRepository: Repository<User> = getRepository(User);

  @Post("/register")
  async register(
    @Res() res: IRegisterResponse,
    @Body() { email, username, password }
  ) {
    try {
      if (!(email && username) || !password) {
        return res.boom.badRequest("不正なリクエスト")
      }

      if (await this.userRepository.findOne({ email })) {
        return res.boom.conflict("Emailはすでに使用されています。")
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
      return res.status(201).send({
        message: "ok"
      })
    } catch (e) {
      throw badImplementation(e)
    }
  }

  @Post("/login")
  async login(
    @Res() res: ILoginResponse,
    @Req() req: Request,
    @Body() { username, password }
  ) {
    try {
      if (!username || !password) {
        return res.boom.badRequest("不正なリクエスト")
      }

      const user = await this.userRepository.findOne({ username })
      const isValid = await user.isValidPassword(password)
      if (!user || !isValid) {
        return res.boom.badRequest("ユーザ名かパスワードが違います")
      }

      const { accessToken, refreshToken } = await AuthService.generateTokenResponse(user).catch(e => e)
      const refreshTokenExpires: Date = Dayjs().add( env.REFRESH_TOKEN_DURATION, env.REFRESH_TOKEN_DURATION_UNIT ).toDate()
      return res
        .cookie(
          "refresh_token",
          refreshToken,
          secureCookie({expires: refreshTokenExpires})
        )
        // accessToken
        .json({ token: { accessToken } })
    }catch(e) {
      return res.boom.forbidden(e.message)
    }
  }

  @Post("/logout")
  @Authorized()
  async logout(
    @Res() res: IResponse,
    @Req() req: { user: any }
  ) {
    await AuthService.revokeRefreshToken(req.user)
    res.locals.data = null
    return res.status(200).json({message: "logout succeed"})
  }

  @Post("/refresh")
  async refresh(
    @Res() res: IResponse,
    @Req() req: Request,
  ) {
    const token = req.cookies["refresh_token"]

    const newRefreshToken: RefreshToken
      = await AuthService.verifyAndSignRefreshToken(token)
    if (!newRefreshToken.token)
      return res.boom.unauthorized("invalid refresh token")

    const accessToken = await AuthService.signAccessToken(newRefreshToken.user)

    return res.status(200)
      .cookie(
        "refresh_token",
        newRefreshToken.token,
        secureCookie({expires: newRefreshToken.expires,}),
      )
      // accessToken
      .send({ token: { accessToken }})
  }

  @Patch("/change-password")
  async changePassword(@Res() res: IResponse, @Body() body: any) {
    const { oldPassword, newPassword } = body
    if (!(oldPassword, newPassword))
      return res.boom.conflict("ユーザ名またはパスワードが不正です。")

    const username = res.locals.jwt?.username
    const user = await this.userRepository.findOne({ username })
    if (!user)
      return res.boom.badRequest("ユーザがみつかりません。")

    if (!user.isValidPassword(oldPassword))
      return res.boom.badRequest("ユーザ名またはパスワードが不正です。")

    await user.setHashPassword(newPassword)

    const errors = await validate(user)
    if (errors.length > 0) {
      return res.boom.badRequest("ValidationError", errors)
    }

    this.userRepository.save(user)
  }
}
