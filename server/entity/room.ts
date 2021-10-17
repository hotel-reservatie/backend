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
import { Hotel } from './hotel'
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

  @Column('decimal')
  currentPrice?: number

  @ManyToOne(() => RoomType)
  @JoinColumn({ name: 'roomTypeId' })
  roomType?: RoomType

  @ManyToOne(() => Hotel)
  @JoinColumn({name: "hotelId"})
  hotel?: Hotel

  @ManyToMany(() => Tag)
  @JoinTable()
  tags?: Tag[]

  @OneToMany(() => Review, review => review.room)
  reviews?: Review[]
}
