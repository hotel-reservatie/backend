import { Arg, Query, Resolver } from 'type-graphql'
import { getRepository, Repository } from 'typeorm'
import { Room, RoomFilters } from '../entity/room'

@Resolver()
export class RoomResolver {
  repository: Repository<Room> = getRepository(Room)

  @Query(() => [Room], { nullable: true })
  async getAllRooms(): Promise<Room[]> {
    const rooms = await this.repository.find({
      relations: ['roomType', 'tags'],
      join: {
        alias: 'room',
        leftJoinAndSelect: {
          "reviews": "room.reviews",
          "user": "reviews.user"
        }
      }
    })

    return rooms
  }

  @Query(() => [Room], { nullable: true })
  async getRooms(@Arg('Filters', { nullable: true }) filters: RoomFilters) {
    try {

      const query = this.repository.createQueryBuilder('room')
      query.leftJoinAndSelect('room.roomType', 'roomType')
      query.leftJoinAndSelect('room.tags', 'tags')
      query.leftJoinAndSelect('room.reviews', 'reviews')
      query.leftJoinAndSelect('room.reservations', 'reservations')
      query.leftJoinAndSelect('reservations.reservation', 'reservation')

      if (filters.roomTypeIds && filters.roomTypeIds.length != 0) {
        query.andWhere('room.roomType.roomTypeId IN (:...ids)', { ids: filters.roomTypeIds })
      }

      if (filters.maxCapacity) {
        query.andWhere('roomType.capacity <= :cap', { cap: filters.maxCapacity })
      }

      if (filters.tagIds && filters.tagIds.length != 0) {
        query.andWhere('room.tags.tagId IN (:...ids)', { ids: filters.tagIds })
      }

      if (filters.minPrice) {
        query.andWhere('room.currentPrice >= :price', { price: filters.minPrice })
      }
      if (filters.maxPrice) {
        query.andWhere('room.currentPrice <= :price', { price: filters.maxPrice })
      }

      if (filters.roomName) {
        query.andWhere('room.roomName LIKE :name', { name: `%${filters.roomName}%` })
      }

      if (filters.startDate || filters.endDate) {
        //available rooms for selected dates


        query.andWhere('IFNULL(reservation.startDate, 0) NOT BETWEEN :startDate and :endDate', { startDate: filters.startDate ? filters.startDate : null, endDate: filters.endDate ? filters.endDate : null })
        query.andWhere('IFNULL(reservation.endDate, 0) NOT BETWEEN :startDate and :endDate', { startDate: filters.startDate ? filters.startDate : null, endDate: filters.endDate ? filters.endDate : null })


      }
      if (filters.roomIds) {
        query.andWhere('room.roomId IN (:...roomIds)', { roomIds: filters.roomIds })
      }

      const res = await query.getMany().catch((e) => {
        throw new Error(e);
      })

      return res
    } catch (error) {
      throw new Error(`Could not apply filters: ${error}`)

    }

  }

  @Query(() => Room, { nullable: true })
  async getRoomById(@Arg('id') id: string): Promise<Room | undefined | null> {
    const room = await this.repository.findOne(id, {
      relations: ['roomType', 'tags'], join: {
        alias: 'room',
        leftJoinAndSelect: {
          "reviews": "room.reviews",
          "user": "reviews.user"
        }
      }
    })

    return room
  }
}
