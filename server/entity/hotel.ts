import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city";


@Entity("hotel")
export class Hotel {
    @PrimaryGeneratedColumn('uuid')
    hotelId?: string

    @Column('text')
    hotelName?: string

    @Column('text')
    description?: string

    @ManyToOne(() => City)
    @JoinColumn( {name: "cityId"})
    city?: City;

}