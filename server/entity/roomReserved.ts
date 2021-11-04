import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./reservation";
import { Room } from "./room";

@ObjectType()
@InputType('RoomReservedInput')
@Entity('roomReserved')
export class RoomReserved {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    roomReservedId?: string

    @Field(type => Room)
    @ManyToOne(() => Room)
    @JoinColumn({name: 'roomId'})
    room?: Room

    @Field(type => Reservation)
    @ManyToOne(() => Reservation)
    @JoinColumn({name: 'reservationId'})
    reservation?: Reservation

    @Field()
    @Column('decimal')
    price?: number
}