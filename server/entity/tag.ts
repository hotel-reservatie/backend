import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";


@Entity('tag')
export class Tag {

    @PrimaryColumn()
    name?: string

}