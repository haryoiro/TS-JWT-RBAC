import { SORT_USER_FIELD, TSortUserField, TSortOrder } from './../types/types';
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
  Authorized,
  QueryParams,
  Req,
} from "routing-controllers";
import { Response, Request, query } from "express"
import { RoleList, User } from "../entity/User";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { IsInt, IsOptional, validate } from "class-validator";
import { ConflictError } from "../common/Errors/Conflict";
import { UserRepository } from "../repositories/User.repository";
import { SortOrder } from "../types/types";


class GetPaginationQuery {
  @IsInt()
  @IsOptional()
  page?: number;

  @IsInt()
  @IsOptional()
  limit?: number;

  @IsOptional()
  field?: TSortUserField

  @IsOptional()
  order?: TSortOrder
}

@JsonController("/admin")
@Authorized([RoleList.Admin])
export class UserController {

  userRepository: Repository<User> = getRepository(User);

  @Get("/users")
  async all(@Res() res: Response, @QueryParams() query: GetPaginationQuery) {
    const { page = 0, limit = 10, field = "createdAt", order = "ASC" } = query

    const allCount = await this.userRepository.count()
    const allPage = Math.floor(allCount/limit)

    const nextPage = page !== allPage && page + 1
    const prevPage = page > 0 && page - 1

    const users  = await getCustomRepository(UserRepository).all(page, limit, field, order)

    return res.status(200).json({
      all_page: allPage,
      current_page: page,
      next_page: nextPage,
      prev_page: prevPage,
      limit,
      sorted_by: field,
      fields: SORT_USER_FIELD,
      result: {
        users
      }
    })
  }

  @Get("/users/:id")
  async getById(@Res() res: Response, @Param("id") id: string) {
    console.log(id)
    const user = await this.userRepository.findOne({where: { id }})
    return res.status(200).json(user)
  }

  @Patch("/users/:id([0-9]+)")
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
  async delete(@Param("id") id: string) {
    await this.userRepository
      .findOneOrFail(id)
      .catch(() => { throw new NotFoundError("User not found") })

    this.userRepository.delete(id)
  }
}