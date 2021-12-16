import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room, RoomRelationInput } from "./room";
import { RoomReserved } from "./roomReserved";
import { User } from "./user";

@ObjectType()
@InputType('ReservationInput')
@Entity('reservation')
export class Reservation {

    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn('uuid')
    reservationId?: string

    @Field(type => User, { nullable: true })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user?: User

    @Field(type => Date, { nullable: true })
    @CreateDateColumn()
    createdAt?: Date

    @Field(type => Date)
    @Column('datetime')
    startDate?: Date

    @Field(type => Date)
    @Column('datetime')
    endDate?: Date

    @Field({ nullable: true })
    @Column('decimal', { nullable: true })
    totalPrice?: number

    @Field({ nullable: true })
    @Column('decimal', { nullable: true })
    totalAmountOfPeople?: number

    @Field({ nullable: true })
    @Column('decimal', { nullable: true })
    totalAmountOfDays?: number

    @Field({ nullable: true })
    @Column('decimal', { nullable: true })
    weekendDays?: number

    @Field(type => [RoomReserved], { nullable: true })
    @OneToMany(() => RoomReserved, roomreserved => roomreserved.reservation, { cascade: true })
    roomsReserved?: RoomReserved[]


}

@InputType('NewReservationInput')
export class ReservationInput extends Reservation {
    @OneToMany(() => RoomReserved, roomreserved => roomreserved.reservation)
    roomsReserved?: RoomReserved[]
}




@ObjectType()
@InputType('ValidateReservationResponse')
export class ValidateReservationResponse {
    @Field()
    isValid?: boolean

    @Field(type => [String], { nullable: true })
    invalidRooms?: string[]

    @Field()
    totalPrice?: number

    @Field({ nullable: true })
    totalDays?: number

    @Field({ nullable: true })
    weekendDays?: number

}
