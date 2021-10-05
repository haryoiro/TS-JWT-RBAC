import { User } from "../entity/User";
import { Body, Controller, Get, Post } from "routing-controllers";
import { getRepository, Repository } from "typeorm";

@Controller("/")
export class HelloWorld {
  userRepository: Repository<User> = getRepository(User);
  
  constructor() { }

  @Get('/')
  async get(): Promise<{ message: string }> {
    return { message: "this page is root" };
  }

  @Post("/")
  async post(@Body() user: User) {
    return this.userRepository.save(user)
  } 
}