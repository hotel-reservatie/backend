import { Field, ID, InputType, ObjectType } from 'type-graphql'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Review } from './review'
import { RoomReserved } from './roomReserved'
import { RoomType } from './roomType'
import { Tag } from './tag'

@ObjectType()
@InputType('RoomInput')
@Entity('room')
export class Room {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  roomId?: string

  @Field({ nullable: true })
  @Column('text')
  roomName?: string

  @Field({ nullable: true })
  @Column('text')
  description?: string

  @Field(type => [String], { nullable: true })
  @Column('simple-array')
  facilities?: string[]

  @Field(type => [String], { nullable: true })
  @Column('simple-array')
  images?: string[]

  @Field({ nullable: true })
  @Column('decimal')
  surface?: number

  @Field({ nullable: true })
  @Column('decimal')
  currentPrice?: number

  @Field({ nullable: true })
  @Column('float')
  weekendMultiplier?: number

  @Field(type => RoomType)
  @ManyToOne(() => RoomType)
  @JoinColumn({ name: 'roomTypeId' })
  roomType?: RoomType

  @Field(type => [Tag], { nullable: true })
  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags?: Tag[]

  @Field(type => [Review], { nullable: true })
  @OneToMany(() => Review, review => review.room)
  reviews?: Review[]

  @OneToMany(() => RoomReserved, roomReserved => roomReserved.room)
  reservations?: RoomReserved[]
}


@InputType('RoomRelationInput')
export class RoomRelationInput {
  @Field(() => ID)
  roomId?: string
}

@InputType('RoomFilters')
export class RoomFilters {

  @Field(type => [String], {nullable: true})
  roomIds?: string[]
  
  @Field(type => [String], { nullable: true })
  roomTypeIds?: string[]

  @Field({ nullable: true })
  maxCapacity?: number

  @Field(type => [String], { nullable: true })
  tagIds?: string[]

  @Field({nullable: true})
  minPrice?: number

  @Field({nullable: true})
  maxPrice?: number

  @Field({nullable: true})
  roomName?: string

  @Field(type => Date, {nullable: true})
  startDate?: Date

  @Field(type => Date, {nullable: true})
  endDate?: Date
}
