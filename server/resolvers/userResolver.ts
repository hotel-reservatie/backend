import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/user";


@Resolver()
export class UserResolver {

    repository: Repository<User> = getRepository(User);

    @Authorized()
    @Query(() => User)
    async getUserInfo(@Ctx() context): Promise<User | undefined | null> {
        try {
            const user = this.repository.findOne(context.request.currentUser.uid, { relations: ['reviews', 'favorites', 'reservations', 'favorites.room', 'reviews.room'] });

            if (user) {
                return user;
            }
            throw new Error('Could not find user in database.')

        } catch (error) {

            throw new Error('Error finding user: ' + error)
        }
    }

    @Authorized()
    @Mutation(() => Boolean)
    async saveUser(@Ctx() context, @Arg('data') user: User) {
        try {
            await this.repository.update(context.request.currentUser.uid, user)

            const updatedUser = await this.repository.findOne(context.request.currentUser.uid)

            
            if (updatedUser) return true


        } catch (e) {
            throw new Error(e)

        }
    }
}