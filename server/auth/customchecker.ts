import { AuthChecker } from 'type-graphql'
import { getMongoManager, getRepository, MongoEntityManager, Repository } from 'typeorm'
import { Context } from 'vm'
import { User } from '../entity/user'
/**
 *@description checks if a user is authorized to use the requested query or mutation based on their role
 */
export const customAuthChecker: AuthChecker<Context> = async ({ context }) =>
// roles, // Optional: you can use roles
{

    const repository: Repository<User> = getRepository(User)

    if (context.request.currentUser) {
        const user = await repository.findOne(
            context.request.currentUser.uid,
        )
        if (user) {
            return true
        }
    }

    return false
}