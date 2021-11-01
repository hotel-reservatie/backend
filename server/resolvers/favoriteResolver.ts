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
    @Mutation(() => Favorite)
    async addFavorite(@Ctx() context, @Arg('roomId') roomId: string): Promise<Favorite | undefined | null> {
        try {
            const existingFavs: Favorite[] = await this.repository.find({ where: { room: roomId } })

            if (existingFavs.length == 0) {
                const newFav = new Favorite()
                newFav.user = { userId: context.request.currentUser.uid }
                newFav.room = { roomId: roomId }

                const result = await this.repository.save(newFav)
                    .catch((ex: QueryFailedError) => { throw new Error(`${ex.name}, room might not exist.`) })

                if (result) {
                    return result
                } else {
                    return undefined
                }
            }

            throw new Error('Room is already in favorites')

        } catch (error) {
            throw new Error(
                `Failed to create new favorite ` + error,
            )
        }
    }

    @Authorized()
    @Mutation(() => String)
    async deleteFavorite(@Arg('roomId') roomId: string, @Ctx() context): Promise<String | undefined | null> {
        try {
            const fav = await this.repository.findOne({ where: { room: roomId }, relations: ['user'] })

            if (fav) {
                if (fav.user.userId == context.request.currentUser.uid) {
                    await this.repository.delete(fav.favoriteId)

                    return fav.favoriteId
                }
                throw new Error('Cannot delete a favorite that is not yours!')
            }
            throw new Error('Not Found')
        } catch (error) {
            throw new Error(
                `Could not delete favorite ` + error,
            )
        }
    }
}