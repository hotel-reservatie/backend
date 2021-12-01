import { Query, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { FiltersResponse, RoomType } from "../entity/roomType";
import { Tag } from "../entity/tag";


@Resolver()
export class FilterResolver {

    roomTypeRepo: Repository<RoomType> = getRepository(RoomType)
    tagsRepo: Repository<Tag> = getRepository(Tag)

    @Query(() => FiltersResponse)
    async getFilters(): Promise<FiltersResponse | undefined | null> {

        const roomTypes = await this.roomTypeRepo.find()
        const tags = await this.tagsRepo.find()

        let maxCapacity = 0

        roomTypes.map((r)=>{
            if(r.capacity >= maxCapacity) maxCapacity = r.capacity
        })

        const filters: FiltersResponse = {
            roomTypes: roomTypes,
            tags: tags,
            maxCapacity: maxCapacity
        }

        return filters
    }

}