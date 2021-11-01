import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Favorite } from "./favorite";
import { Review } from "./review";

@ObjectType()
@InputType('UserInput')
@Entity('user')
export class User {

    @Field()
    @PrimaryColumn('uuid')
    userId?: string

    @Field({nullable: true})
    @Column('text', {nullable: true})
    firstName?: string

    @Field({nullable: true})
    @Column('text', {nullable: true})
    lastName?: string

    @Field({nullable: true})
    @Column('text', {nullable: true})
    userName?: string
    
    @Field({nullable: true})
    @Column('text', {nullable: false})
    email?: string

    @Field({nullable: true})
    @Column('text', {nullable: true})
    phone?: string

    @Column('bool')
    admin?: boolean

    @OneToMany(() => Review, review => review.user)
    reviews?: Review[]

    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites?: Favorite[]
}