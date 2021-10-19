import { NextFunction, Request, Router, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Room } from "../entity/room";


export class RoomController {
    public router = Router()

    public repository: Repository<Room>

    constructor() {
        this.repository = getRepository(Room)
        this.router.get('/', this.all)
    }

    all = async(request: Request, response: Response, next: NextFunction) => {
        const hotels = await this.repository.find({relations: ['roomType', 'tags']})


        response.send(hotels)
    }
}