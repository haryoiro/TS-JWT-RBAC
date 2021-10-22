import { SORT_USER_FIELD, TSortUserField, TSortOrder } from './../types/types';
import {
  Param,
  Body,
  Get,
  Delete,
  JsonController,
  Patch,
  Res,
  Authorized,
  QueryParams,
} from "routing-controllers";
import { Response } from "express"
import { RoleList, User } from "../entity/User";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { IsInt, IsOptional, validate } from "class-validator";
import { UserRepository } from "../repositories/User.repository";


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
    const user = await await getCustomRepository(UserRepository).one(id)
    return res.status(200).json(user)
  }

  @Patch("/users/:id")
  async edit(@Res() res: Response, @Param("id") id: string, @Body() body: any) {
    const { username=null, email=null, role=null } = body

    const user = await getCustomRepository(UserRepository).one(id)

    if (username) user.username = username
    if (email   ) user.email    = email
    if (role    ) user.role     = role

    const errors = await validate(user)
    if (errors.length > 0) {
      return res.boom.badRequest("validation Error")
    }

    const saved = await this.userRepository.save(user)
    delete saved.passwordHash

    return res.status(200).json(saved)
  }


  @Delete("/users/:id")
  async delete(@Res() res: Response, @Param("id") id: string) {
    const user = await getCustomRepository(UserRepository).one(id)
    if (!user) {
      return res.boom.notFound("User not found.")
    }

    await this.userRepository.delete({ id })
    return res.status(204).json({
      message: "User is removed"
    })
  }
}