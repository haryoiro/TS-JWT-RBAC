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
import { User } from "../entity/User";
import { getRepository, Repository } from "typeorm";
import { checkJwt, checkRole } from "../middleware/AuthMiddleware";
import { validate } from "class-validator";
import { ConflictError } from "../common/Errors/Conflict";


const checkAdmin = checkRole(["ADMIN"])

@JsonController()
export class UserController {
  userRepository: Repository<User> = getRepository(User);

  @Get("/users")
  @UseAfter(checkJwt, checkAdmin)
  async list() {
    try {
      return await this.userRepository.find()
    } catch (error) {
      console.log("Iser mpt fpintd", error)
    }
  }

  @Get("/users/:id([0-9]+)")
  @UseAfter(checkJwt, checkAdmin)
  async get(@Param("id") id: string) {
    try {
      return await this.userRepository.findOneOrFail(id, {
        select: ["id", "username", "role"]
      })
    } catch (error) {
      return new NotFoundError("User not Found")
    }
  }

  @Patch("/users/:id([0-9]+)")
  @UseBefore(checkJwt, checkRole(["Admin"]))
  async edit(@Param("id") id: string, @Body() body: any) {
    const { username, role } = body

    const user = await this.userRepository
      .findOneOrFail(id)
      .catch(() => { throw new NotFoundError("User not found") })

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
  @UseBefore(checkJwt, checkRole(["Admin"]))
  async delete(@Param("id") id: string) {
    await this.userRepository
      .findOneOrFail(id)
      .catch(() => { throw new NotFoundError("User not found") })
    
    this.userRepository.delete(id)
  }
}