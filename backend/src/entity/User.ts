import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IsNotEmpty, IsEmail, IsDate } from "class-validator";
import * as bcrypt from "bcryptjs";
import * as config from 'config';
import * as jwt from "jsonwebtoken";
import { Role } from "./Role";
import * as Dayjs from "dayjs";

// JWT SECRET
const secret: string = config.get("express.jwtSecret")

export enum RoleList {
  Admin,
  Moderator,
  User,
}

@Entity("User")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  username: string;

  @Column()
  @IsEmail()
  @PrimaryColumn()
  email: string;

  @Column()
  verified: boolean

  @Column()
  passwordHash: string;

  @Column()
  role: RoleList

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  async checkPasswordIsValid(password: string) {
    return await bcrypt.compareSync(password, this.passwordHash);
  }

  async setHashPassword(password: string) {
    const saltRound = 10
    return this.passwordHash = await bcrypt.hashSync(password, saltRound)
  }

  async token(duration: number = null) {
    return await jwt.sign(
      {
        exp: Dayjs().add(duration || 1000, 'minutes').unix(),
        iat: Dayjs().unix(),
        sub: this.id,
        role: this.role,
      },
      secret,
      {
        algorithm: "HS256"
      },
    );
  }

  constructor(username, email) {
    this.username = username
    this.email = email
    this.verified = false
    this.role = RoleList.User
  }
}