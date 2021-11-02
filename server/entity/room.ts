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
}


@InputType('RoomRelationInput')
export class RoomRelationInput {
  @Field(() => ID)
  roomId?: string
}