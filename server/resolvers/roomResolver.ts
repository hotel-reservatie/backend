import { Arg, Query, Resolver } from 'type-graphql'
import { getRepository, Repository } from 'typeorm'
import { Room } from '../entity/room'

@Resolver()
export class RoomResolver {
  repository: Repository<Room> = getRepository(Room)

  @Query(() => [Room], { nullable: true })
  async getAllRooms(): Promise<Room[]> {
    const rooms = await this.repository.find({
      relations: ['roomType', 'tags', 'reviews'],
    })

    return rooms
  }

  @Query(() => Room, { nullable: true })
  async getRoomById(@Arg('id') id: string): Promise<Room | undefined | null> {
    const room = await this.repository.findOne(id, {relations: ['roomType', 'tags', 'reviews']})

    return room
  }
}
