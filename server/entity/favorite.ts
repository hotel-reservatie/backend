import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";
import { User } from "./user";

@Entity('favorite')
export class Favorite {

    @PrimaryGeneratedColumn('uuid')
    favoriteId?: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user?: User

    @ManyToOne(() => Room)
    @JoinColumn({name: 'roomId'})
    room?: Room
}