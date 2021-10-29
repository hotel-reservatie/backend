import { Field, ID, InputType, ObjectType } from 'type-graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Room } from './room'
import { User } from './user'

@ObjectType()
@InputType('ReviewInput')
@Entity('review')
export class Review {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  reviewId?: string

//   @Field(type => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User

//   @Field( type => Room)
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room?: Room

  @Field()
  @Column('int')
  reviewScore?: number

  @Field()
  @Column('text')
  title?: string

  @Field()
  @Column('text')
  description?: string
}
