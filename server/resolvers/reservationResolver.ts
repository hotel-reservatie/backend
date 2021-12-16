import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository, QueryFailedError, Repository } from "typeorm";
import { Reservation, ReservationInput, ValidateReservationResponse } from "../entity/reservation";
import { Room, RoomRelationInput } from "../entity/room";
import { RoomReserved } from "../entity/roomReserved";
import { User } from "../entity/user";


@Resolver()
export class ReservationResolver {
    repository: Repository<Reservation> = getRepository(Reservation)

    reservedRoomsRepository: Repository<RoomReserved> = getRepository(RoomReserved)
    roomRepository: Repository<Room> = getRepository(Room)
    userRepository: Repository<User> = getRepository(User)

    @Authorized()
    @Query(() => [Reservation])
    async getUserReservations(@Ctx() context): Promise<Reservation[] | undefined | null> {
        try{

            const reservations = await this.repository.find({ where: { user: context.request.currentUser.uid }, relations: ['roomsReserved', 'roomsReserved.room', 'user', 'roomsReserved.room.roomType'], order: {createdAt: "ASC"} })
            
            return reservations
        } catch(e){
            throw new Error(
                `Failed to fetch reservations. ` + e,
            )
        }
    }

    
    @Authorized()
    @Query(() => Reservation)
    async getReservation(@Ctx() context, @Arg('data') reservationId: string): Promise<Reservation | undefined | null> {
        try{
            const reservation = await this.repository.findOne(reservationId, {relations: ['roomsReserved', 'roomsReserved.room', 'user', 'roomsReserved.room.roomType']});

            if(reservation){
                if(reservation.user.userId == context.request.currentUser.uid){
                    return reservation;
                }
                throw new Error('Cannot view a reservation that is not yours!')
            }
            throw new Error('Could not find reservation with id ' + reservationId)
        }catch(e){
            console.log(e);
            
            throw new Error(
                `Failed to fetch reservation. ` + e,
            )
        }
    }

    @Authorized()
    @Mutation(() => Reservation)
    async createReservation(@Ctx() context, @Arg('data') res: ReservationInput, @Arg('roomIds', type => [String]) roomIds: string[]): Promise<Reservation | undefined | null> {
        try {
            const user = await this.userRepository.findOne(context.request.currentUser.uid)

            console.log(res);

            if (await this.validateRooms(roomIds, res) && user) {

                await this.userRepository.update(user.userId, res.user)

                res.roomsReserved = []
                res.user = { userId: context.request.currentUser.uid }

                let totalPrice = 0
                await Promise.all(roomIds.map(async (roomId) => {
                    const roomPrice = await this.calculateRoomPrice(roomId, res.startDate, res.endDate);
                    res.roomsReserved.push({ room: { roomId: roomId }, price: roomPrice })
                    totalPrice += roomPrice
                }))

                res.totalPrice = totalPrice;
                res.totalAmountOfDays = this.daysBetween(res.startDate, res.endDate) + 1
                res.weekendDays = this.weekendDays(res.startDate, res.endDate)

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
                    const resAfterUpdate = await this.repository.findOne({ where: { reservationId: result.reservationId }, relations: ['roomsReserved', 'roomsReserved.room', 'user'] })
                    return resAfterUpdate
                }
            }
        } catch (error) {
            throw new Error(
                `Failed to create new reservation. ` + error,
            )
        }
    }

    @Query(() => ValidateReservationResponse)
    async validateReservation(@Arg('data') res: ReservationInput, @Arg('roomIds', type => [String]) roomIds: string[]) {
        try {

            const response: ValidateReservationResponse = { isValid: true, invalidRooms: [], totalPrice: 0 }

            if (!res.startDate && !res.endDate) {
                response.isValid = false;
            } else {

                let totalPrice = 0

                await Promise.all(roomIds.map(async (roomId) => {
                    if (! await this.isValidRoom(roomId, res.startDate, res.endDate)) {
                        response.isValid = false;
                        response.invalidRooms.push(roomId)
                    }

                    const price = await this.calculateRoomPrice(roomId, res.startDate, res.endDate)
                    totalPrice += price


                }))

                if (response.isValid) response.totalPrice = totalPrice

                response.totalDays = this.daysBetween(res.startDate, res.endDate) + 1
                response.weekendDays = this.weekendDays(res.startDate, res.endDate)
            }






            return response

        } catch (error) {

        }
    }

    @Authorized()
    @Mutation(() => String)
    async deleteReservation(@Arg('reservationId') reservationId: string, @Ctx() context): Promise<string> {
        try {
            const reservation = await this.repository.findOne(reservationId, { relations: ['user'] })

            if (reservation) {
                if (reservation.user.userId == context.request.currentUser.uid) {

                    await this.reservedRoomsRepository.delete({ reservation: { reservationId: reservationId } })
                    await this.repository.delete(reservationId)
                    return reservationId
                }
                throw new Error('Cannot delete a reservation that is not yours!')
            }
            throw new Error('Not Found')
        } catch (error) {
            throw new Error(
                `Could not delete review with id ${reservationId} failed. ` + error,
            )
        }
    }



    private async isValidRoom(roomId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const reservedRooms = await this.reservedRoomsRepository.find({ relations: ['reservation', 'room'] })
        let isValid = true
        reservedRooms.map((r) => {

            if (r.room.roomId == roomId) {

                if (this.checkBetweenDates(r.reservation.startDate, r.reservation.endDate, startDate)
                    || this.checkBetweenDates(r.reservation.startDate, r.reservation.endDate, endDate)) {

                    isValid = false;
                }
            }
        })


        return isValid
    }

    private async validateRooms(roomIds: string[], reservation: ReservationInput): Promise<boolean> {

        const reservedRooms = await this.reservedRoomsRepository.find({ relations: ['reservation', 'room'] })

        reservedRooms.map((r) => {
            if (roomIds.includes(r.room.roomId)) {
                if (this.checkBetweenDates(r.reservation.startDate, r.reservation.endDate, reservation.startDate)
                    || this.checkBetweenDates(r.reservation.startDate, r.reservation.endDate, reservation.endDate)) {
                    throw new Error(`One or more rooms you have listed are reserved in this period.`)
                }
            }
        })

        return true
    }

    private async calculateRoomPrice(roomId: string, startDate: Date, endDate: Date): Promise<number> {

        const room: Room = await this.roomRepository.findOne(roomId);

        if (room) {


            const amountOfDays = this.daysBetween(startDate, endDate) + 1;
            const amountOfWeekendDays = this.weekendDays(startDate, endDate);

            const amountOfWorkDays = amountOfDays - amountOfWeekendDays;
            const totalPrice = (amountOfWorkDays * room.currentPrice) + (amountOfWeekendDays * (room.currentPrice * room.weekendMultiplier))



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

    private daysBetween(date1: Date, date2: Date): number {

        // The number of milliseconds in one day
        const ONE_DAY = 1000 * 60 * 60 * 24;

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date1.getTime() - date2.getTime());

        // Convert back to days and return
        return Math.round(differenceMs / ONE_DAY);

    }

    private weekendDays(date1: Date, date2: Date): number {
        var count = 0;
        const curDate = new Date(date1.getTime());
        while (curDate <= date2) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek == 0 || dayOfWeek == 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    }
}