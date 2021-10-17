import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Country } from "./country"

@Entity("city")
export class City {
    @PrimaryGeneratedColumn('uuid')
    cityId?: string

    @Column('text')
    cityName?: string

    @Column('int')
    postalCode?: number

    @ManyToOne(() => Country)
    @JoinColumn({name: 'countryId'})
    country?: Country

    
}