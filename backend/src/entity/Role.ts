import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity("Role")
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
