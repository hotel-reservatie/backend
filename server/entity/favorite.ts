import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";
import { User } from "./user";


@ObjectType()
@InputType('FavoriteInput')
@Entity('favorite')
export class Favorite {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    favoriteId?: string

    @Field(type => User)
    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user?: User

    @Field(type => Room)
    @ManyToOne(() => Room)
    @JoinColumn({name: 'roomId'})
    room?: Room
}