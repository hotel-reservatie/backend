import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("city")
export class City {
    @PrimaryGeneratedColumn('uuid')
    cityId?: string

    @Column('text')
    cityName?: string

    @Column('int')
    postalCode?: number

    
}