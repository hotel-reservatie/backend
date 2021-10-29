import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";

@ObjectType()
@InputType('TagInput')
@Entity('tag')
export class Tag {
    @Field(() => ID, { nullable: true }) 
    @PrimaryGeneratedColumn('uuid')
    tagId?: string

    @Field()
    @Column('text', {unique: true})
    name?: string

}