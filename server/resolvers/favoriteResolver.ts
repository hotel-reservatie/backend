import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository, QueryFailedError, Repository } from "typeorm";
import { Favorite } from "../entity/favorite";
import { Room } from "../entity/room";


@Resolver()
export class FavoriteResolver {

    repository: Repository<Favorite> = getRepository(Favorite)

    @Authorized()
    @Query(() => [Room])
    async getUserFavorites(@Ctx() context): Promise<Room[] | undefined | null> {
        const favs = await this.repository.find({
            where: { user: context.request.currentUser.uid }, join: {
                alias: 'favorite',
                leftJoinAndSelect: {
                    "room": "favorite.room",
                    "roomType": "room.roomType",
                    "reviews": "room.reviews",
                    "user": "reviews.user"
                }
            }
        })

        const rooms: Room[] = []
        favs.map((f: Favorite) => {
            rooms.push(f.room)
        })
        return rooms
    }

    @Authorized()
    @Mutation(() => String)
    async toggleFavorite(@Arg('roomId') roomId: string, @Ctx() context): Promise<String | undefined | null> {
        try {
            const fav = await this.repository.findOne({ where: { room: roomId, user: context.request.currentUser.uid }, relations: ['user'] })

            if (fav) {
                await this.repository.delete(fav.favoriteId)

                return fav.favoriteId
            } else {
                const newFav = new Favorite()
                newFav.user = { userId: context.request.currentUser.uid }
                newFav.room = { roomId: roomId }

                const result = await this.repository.save(newFav)
                    .catch((ex: QueryFailedError) => { throw new Error(`${ex.name}, room might not exist.`) })

                if (result) {
                    return result.favoriteId
                } else {
                    return undefined
                }
            }
        } catch (e) {
            throw new Error(e)
            
        }
    }
}