import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./reservation";
import { Room } from "./room";

@Entity('roomReserved')
export class RoomReserved {
    @PrimaryGeneratedColumn('uuid')
    roomReservedId?: string

    @ManyToOne(() => Room)
    @JoinColumn({name: 'roomId'})
    room?: Room

    @ManyToOne(() => Reservation)
    @JoinColumn({name: 'reservationId'})
    reservation?: Reservation

    @Column('decimal')
    price?: number
}