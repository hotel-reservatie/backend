import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Favorite } from "./favorite";
import { Reservation } from "./reservation";
import { Review } from "./review";

@ObjectType()
@InputType('UserInput')
@Entity('user')
export class User {

    @Field({nullable: true})
    @PrimaryColumn('uuid')
    userId?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    firstName?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    lastName?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    userName?: string

    @Field({ nullable: true })
    @Column('text', { nullable: false })
    email?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    reservationEmail?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    phone?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    address?: string

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    city?: string

    @Field({ nullable: true })
    @Column('decimal', { nullable: true })
    postal?: number

    @Column('bool')
    admin?: boolean

    @Field(type => [Review], {nullable: true})
    @OneToMany(() => Review, review => review.user)
    reviews?: Review[]

    @Field(type => [Favorite], {nullable: true})
    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites?: Favorite[]

    @Field(type => [Reservation], {nullable: true})
    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations?: Reservation[]
}
