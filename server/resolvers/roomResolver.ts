import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql'
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

      if (filters.minPrice || filters.maxPrice) {
        if (filters.minPrice && filters.maxPrice) {
          query.andWhere('room.currentPrice BETWEEN :minprice AND :maxprice', { minprice: filters.minPrice, maxprice: filters.maxPrice })
        } else if (filters.minPrice) {
          query.andWhere('room.currentPrice >= :price', { price: filters.minPrice })
        } else if (filters.maxPrice) {
          query.andWhere('room.currentPrice <= :price', { price: filters.maxPrice })
        }
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

      if (filters.tagIds && filters.tagIds.length != 0) {

        const filteredByTag: Room[] = [];

        filters.tagIds.map((tagId) => {
          res.map((r) => {
            const tagids = r.tags.map((t) => { return t.tagId })

            if (tagids.includes(tagId)) {
              if (filteredByTag.filter(room => room.roomId == r.roomId).length == 0) {
                filteredByTag.push(r);
              }
            }
          })
        })
        return filteredByTag;
      }
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
