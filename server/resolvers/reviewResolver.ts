import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { getRepository, QueryFailedError, Repository } from 'typeorm'
import { ReviewInput, Review, ReviewRoomInput, ReviewUpdateInput } from '../entity/review'

@Resolver()
export class ReviewResolver {
  repository: Repository<Review> = getRepository(Review)


  @Authorized()
  @Mutation(() => Review, { nullable: true })
  async addReview(
    @Arg('data') newReview: ReviewInput,
    @Ctx() context
  ): Promise<Review | undefined | null> {

    console.log("Context: ", context);

    try {

      newReview.user = { userId: context.request.currentUser.uid }

      const result = await this.repository
        .save(newReview)
        .catch((ex: QueryFailedError) => { throw new Error(ex.name) })

      if (result) {
        return result
      } else {
        return undefined
      }
    } catch (error) {
      throw new Error(
        `Could not create new review. ` + error,
      )
    }

  }

  @Authorized()
  @Mutation(() => Review)
  async updateReview(
    @Arg('reviewId') reviewId: string,
    @Arg('data') updatedReview: ReviewUpdateInput,
    @Ctx() context
  ): Promise<Review | undefined | null> {
    try {
      const review: Review | undefined = await this.repository.findOne(reviewId, { relations: ['user'] })


      if (review) {

        if (review.user.userId == context.request.currentUser.uid) {
          await this.repository.update(reviewId, updatedReview)

          const resAfterUpdate = await this.repository.findOne(reviewId, {
            relations: ['room', 'user'],
          })

          return resAfterUpdate
        }

        throw new Error('Cannot update a review that is not yours!')
      }

      throw new Error('Review Not Found')
    } catch (error) {
      throw new Error(
        `Update of the review with id ${reviewId} failed.` + error,
      )
    }
  }

  @Mutation(() => String)
  async deleteReview(@Arg('reviewId') reviewId: string, @Ctx() context) {
    try {
      const review = await this.repository.findOne(reviewId)
      if (review) {
        if (review.user.userId == context.request.currentUser.uid) {

          console.log(review);
  
          await this.repository.delete(reviewId)
          return reviewId
        }

        throw new Error('Cannot delete a review that is not yours!')
      }
      throw new Error('Not Found')
    } catch (error) {
      throw new Error(
        `Could not delete review with id ${reviewId} failed. ` + error,
      )
    }
  }
}
