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

  async generateToken() {
    return await jwt.sign(
      {
        userId: this.id,
        username: this.username,
        Role: this.role,
      },
      secret,
      {
        expiresIn: "1h",
        algorithm: "HS256"
      },
    );
  }
}