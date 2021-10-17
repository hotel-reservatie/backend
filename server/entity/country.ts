import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('country')
export class Country {
    @PrimaryGeneratedColumn('uuid')
    countryId?: string

    @Column('text')
    countryName?: string
}