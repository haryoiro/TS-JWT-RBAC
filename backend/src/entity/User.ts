import { env } from './../config/Environment';
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
import { V4 as paseto, ProduceOptions } from "paseto"
import { IsNotEmpty, IsEmail, IsDate } from "class-validator";
import * as bcrypt from "bcryptjs";
import * as config from 'config';
import * as jwt from "jsonwebtoken";
import { Role } from "./Role";
import * as Dayjs from "dayjs";
import { createPrivateKey } from "crypto";

export enum RoleList {
  Admin,
  Moderator,
  User,
}

@Entity("User")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  async isValidPassword(password: string) {
    return await bcrypt.compareSync(password, this.passwordHash);
  }

  async setHashPassword(password: string) {
    const saltRound = 10
    return this.passwordHash = await bcrypt.hashSync(password, saltRound)
  }

  constructor(username, email) {
    this.username = username
    this.email = email
    this.verified = false
    this.role = RoleList.User
  }
}