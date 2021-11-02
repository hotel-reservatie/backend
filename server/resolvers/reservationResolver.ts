import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getRepository, QueryFailedError, Repository } from "typeorm";
import { Reservation, ReservationInput } from "../entity/reservation";
import { Room, RoomRelationInput } from "../entity/room";
import { RoomReserved } from "../entity/roomReserved";


@Resolver()
export class ReservationResolver {
    repository: Repository<Reservation> = getRepository(Reservation)

    reservedRoomsRepository: Repository<RoomReserved> = getRepository(RoomReserved)
    roomRepository: Repository<Room> = getRepository(Room)

    @Query(() => [Reservation])
    async getReservations() {
        const res = await this.repository.find({ relations: ['roomsReserved', 'roomsReserved.room'] })

        return res


    }

    @Mutation(() => Reservation)
    async createReservation(@Arg('data') res: ReservationInput, @Arg('roomIds', type => [String]) roomIds: string[]) {
        try {


            if (await this.validateReservation(roomIds, res)) {

                res.roomsReserved = []
                res.totalPrice = 0
                await Promise.all(roomIds.map(async (roomId) => {
                    const roomPrice = await this.calculateRoomPrice(roomIds[0], res.startDate, res.endDate);
                    res.roomsReserved.push({ room: { roomId: roomId }, price: roomPrice })
                    res.totalPrice += roomPrice
                }))

                console.log(res);
                

                const result = await this.repository
                    .save(res)
                    .catch((ex: QueryFailedError) => {
                        console.log(ex);

                        if (ex.driverError.errno == 1452) {
                            throw new Error(`${ex.driverError.code}, one of the given rooms does not exist.`)
                        } else {
                            throw new Error(`${ex.driverError.code}, maybe invalid date input?`)
                        }
                    })
                if (result) {

                    const resAfterUpdate = await this.repository.findOne({ where: { reservationId: result.reservationId }, relations: ['roomsReserved', 'roomsReserved.room'] })
                    return resAfterUpdate
                }
            }
        } catch (error) {

            throw new Error(
                `Failed to create new favorite. ` + error,
            )
        }
    }

    private async validateReservation(roomIds: string[], reservation: ReservationInput): Promise<boolean> {

        const reservedRooms = await this.reservedRoomsRepository.find({ relations: ['reservation', 'room'] })

        reservedRooms.map((r) => {
            if (roomIds.includes(r.room.roomId)) {
                if (this.checkBetweenDates(r.reservation.startDate, r.reservation.endDate, reservation.startDate)
                    || this.checkBetweenDates(r.reservation.startDate, r.reservation.endDate, reservation.endDate)) {
                    // throw new Error(`One or more rooms you have listed are reserved in this period.`)
                }
            }
        })

        return true
    }

    private async calculateRoomPrice(roomId: string, startDate: Date, endDate: Date): Promise<number> {

        const room: Room = await this.roomRepository.findOne(roomId);

        if (room) {
            const amountOfDays = this.daysBetween(startDate, endDate)
            const totalPrice = amountOfDays * room.currentPrice


            return totalPrice
        }

        throw new Error('Could not find room')

    }

    private checkBetweenDates(startDate: Date, endDate: Date, checkDate: Date): boolean {

        if (checkDate.getTime() <= endDate.getTime() && checkDate.getTime() >= startDate.getTime()) {
            return true
        }

        return false
    }

    private daysBetween(date1: Date, date2: Date) {

        // The number of milliseconds in one day
        const ONE_DAY = 1000 * 60 * 60 * 24;

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date1.getTime() - date2.getTime());

        // Convert back to days and return
        return Math.round(differenceMs / ONE_DAY);

    }
}