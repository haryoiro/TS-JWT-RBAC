import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { IsNotEmpty, IsEmail, IsDate } from "class-validator";
import * as bcrypt from "bcryptjs";
import * as config from 'config';
import * as jwt from "jsonwebtoken";

// JWT SECRET
const secret: string = config.get("express.jwtSecret")

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
  @IsDate()
  emailVerifiedAt: Date;

  @Column()
  passwordHash: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  checkPasswordIsValid(password: string) {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  setHashPassword(password: string) {
    return this.passwordHash = bcrypt.hashSync(password, 8)
  }

  async generateToken() {
    return await jwt.sign(
      {
        userId: this.id,
        username: this.username
      },
      secret,
      {
        expiresIn: "1h"
      },
    );
  }
}