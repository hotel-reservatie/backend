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

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  roomId?: string

  @Column('text')
  roomName?: string

  @Column('text')
  description?: string

  @Column('simple-array')
  facilities?: string[]

  @Column('simple-array')
  images?: string[]

  @Column('decimal')
  surface?: number

  @Column('decimal')
  currentPrice?: number

  @ManyToOne(() => RoomType)
  @JoinColumn({ name: 'roomTypeId' })
  roomType?: RoomType

  @ManyToMany(() => Tag, {cascade: true})
  @JoinTable()
  tags?: Tag[]

  @OneToMany(() => Review, review => review.room)
  reviews?: Review[]
}
