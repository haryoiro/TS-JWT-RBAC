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
import { IsNotEmpty, IsEmail, IsDate } from "class-validator";
import * as bcrypt from "bcryptjs";

export enum RoleList {
  Admin,
  Moderator,
  User,
}

@Entity("User")
export class User {
  static createQueryBuilder(arg0: string) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
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
  isActive: boolean

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