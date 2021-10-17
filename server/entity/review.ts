import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";
import { User } from "./User";

@Entity('review')
export class Review {

    @PrimaryGeneratedColumn('uuid')
    reviewId?: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user?: User

    @ManyToOne(() => Room)
    @JoinColumn({ name: 'roomId' })
    room?: Room

    @Column('int')
    reviewScore?: number

    @Column('text')
    title?: string

    @Column('text')
    description?: string

}