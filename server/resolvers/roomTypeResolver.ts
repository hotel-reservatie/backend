import { Query, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Room } from "../entity/room";
import { RoomType, RoomTypeResponse } from "../entity/roomType";

@Resolver()
export class RoomTypeResolver {
    repository: Repository<RoomType> = getRepository(RoomType)
    roomRepository: Repository<Room> = getRepository(Room)

    @Query(() => [RoomTypeResponse])
    async getRoomTypes(): Promise<RoomTypeResponse[] | null | undefined> {

        const roomTypes = await this.repository.find() as RoomTypeResponse[]

        const roomTypesWithPrice = await Promise.all(roomTypes.map(async (r) => {
            const query = this.roomRepository.createQueryBuilder('room')

            query.select("min(room.currentPrice)", "min")
            query.where("room.roomTypeId = :id", { id: r.roomTypeId })
            const maxPrice = await query.getRawOne();
            if (maxPrice.min) {
                r.startingPrice = parseFloat(maxPrice.min)
            }

            return r;
        }))

        return roomTypesWithPrice
    }
}