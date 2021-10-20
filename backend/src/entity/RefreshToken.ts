import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity("RefreshToken")
export class RefreshToken {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    token: string

    @Column()
    jwtid: string

    @OneToOne(type => User, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn()
    user: User

    @Column()
    expires: Date

    constructor(token?: string, user?: User, expires?: Date, jwtid?: string) {
        this.token = token
        this.expires = expires
        this.user = user
        this.jwtid = jwtid
    }
}
