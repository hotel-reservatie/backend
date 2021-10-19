import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";


@Entity('tag')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    tagId?: string

    @Column('text', {unique: true})
    name?: string

}