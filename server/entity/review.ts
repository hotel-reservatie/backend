import { Field, ID, InputType, ObjectType } from 'type-graphql'
import {
  Column,
  CreateDateColumn,
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

  @Field(type => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User

  @Field(type => Room)
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room?: Room

  @Field()
  @Column('int')
  reviewScore?: number

  @Field()
  @Column('text')
  title?: string

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string

  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt?: Date
}

@InputType('NewReviewInput')
@Entity('review')
export class ReviewInput extends Review {
  @Field(type => ReviewRoomInput)
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room?: Room

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User

}

@InputType('ReviewUpdateInput')
@Entity('review')
export class ReviewUpdateInput extends Review {

  @Field(type => ReviewRoomInput, { nullable: true })
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room?: Room

  @Field({ nullable: true })
  @Column('int')
  reviewScore?: number

  @Field({ nullable: true })
  @Column('text')
  title?: string

}

@InputType('ReviewRoomInput')
export class ReviewRoomInput {
  @Field(() => ID)
  roomId?: string
}

