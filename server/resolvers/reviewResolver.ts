import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { getRepository, QueryFailedError, Repository } from 'typeorm'
import { ReviewInput, Review, ReviewRoomInput } from '../entity/review'
import { Room } from '../entity/room'

@Resolver()
export class ReviewResolver {
  repository: Repository<Review> = getRepository(Review)

  @Mutation(() => Review, { nullable: true })
  async addReview(
    @Arg('data') newReview: ReviewInput,
  ): Promise<Review | undefined | null> {

    try {
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

  @Mutation(() => Review)
  async updateReview(
    @Arg('reviewId') reviewId: string,
    @Arg('data') updatedReview: ReviewInput,
  ): Promise<Review | undefined | null> {
    try {
      const review: Review | undefined = await this.repository.findOne(reviewId)

      if (review) {
        await this.repository.update(reviewId, updatedReview)

        const resAfterUpdate = await this.repository.findOne(reviewId, {
          relations: ['room'],
        })

        return resAfterUpdate
      }

      throw new Error('Review Not Found')
    } catch (error) {
      throw new Error(
        `Update of the review with id ${reviewId} failed.` + error,
      )
    }
  }

  @Mutation(() => String)
  async deleteReview(@Arg('reviewId') reviewId: string) {
    try {
      const review = await this.repository.findOne(reviewId)
      if (review) {
        console.log(review);

        await this.repository.delete(reviewId)
        return reviewId
      }
      throw new Error('Not Found')
    } catch (error) {
      throw new Error(
        `Could not delete review with id ${reviewId} failed. ` + error,
      )
    }
  }
}
