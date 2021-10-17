import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('roomType')
export class RoomType {

    @PrimaryGeneratedColumn('uuid')
    roomTypeId?: string

    @Column('text')
    typeName?: string

}