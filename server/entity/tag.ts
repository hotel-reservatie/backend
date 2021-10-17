import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tag')
export class Tag {

    @PrimaryGeneratedColumn('uuid')
    tagId?: string

    @Column('text')
    name?: string

}