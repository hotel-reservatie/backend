import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@InputType('RoomTypeInput')
@Entity('roomType')
export class RoomType {
    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn('uuid')
    roomTypeId?: string

    @Field()
    @Column('text')
    typeName?: string

    @Field()
    @Column('text')
    description?: string

    @Field()
    @Column()
    capacity?: number

    @Field({nullable: true})
    @Column('text')
    sampleImage?: string

}

@ObjectType()
@InputType('RoomTypeResponse')
export class RoomTypeResponse extends RoomType {
    @Field({nullable: true})
    startingPrice?: number
}