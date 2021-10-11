import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  NotFoundError,
  UseBefore,
  Patch,
  BadRequestError,
  Res,
  UseAfter,
} from "routing-controllers";
import { Response } from "express"
import { RoleList, User } from "../entity/User";
import { getRepository, Repository } from "typeorm";
import { checkJwt, checkRole } from "../middleware/AuthMiddleware";
import { validate } from "class-validator";
import { ConflictError } from "../common/Errors/Conflict";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { success } from "../common/createResponse";


const checkAdmin = checkRole([RoleList.Admin])

@JsonController("/admin")
export class UserController {
  userRepository: Repository<User> = getRepository(User);

  // GetAll
  @Get("/users")
  @UseAfter(checkJwt, checkAdmin)
  async getAllUsers(@Res() res: Response) {
    const users = await this.userRepository.find()
    return success(
      res,
      users,
    )
  }

  @Get("/users/:id([0-9]+)")
  @UseAfter(checkJwt, checkAdmin)
  async getById(@Param("id") id: string) {
    try {
      return await this.userRepository.findOneOrFail(id, {
        select: ["id", "username", "role"]
      })
    } catch (error) {
      return new NotFoundError("User not Found")
    }
  }

  @Patch("/users/:id([0-9]+)")
  @UseBefore(checkJwt, checkAdmin)
  async edit(@Param("id") id: string, @Body() body: any) {
    const { username, role } = body

    const user = await this.userRepository.findOneOrFail(id)

    user.username = username
    user.role = role

    const errors = await validate(user)
    if (errors.length > 0) {
      throw new BadRequestError()
    }
    await this.userRepository
      .save(user)
      .catch(() => { throw new ConflictError("username already in use") })
  }


  @Delete("/users/:id([0-9]+)")
  @UseBefore(checkJwt, checkAdmin)
  async delete(@Param("id") id: string) {
    await this.userRepository
      .findOneOrFail(id)
      .catch(() => { throw new NotFoundError("User not found") })

    this.userRepository.delete(id)
  }
}