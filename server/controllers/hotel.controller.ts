import { NextFunction, Request, Router, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Hotel } from "../entity/hotel";


export class HotelController {
    public router = Router()

    public repository: Repository<Hotel>

    constructor() {
        this.repository = getRepository(Hotel)
        this.router.get('/', this.all)
    }

    all = async(request: Request, response: Response, next: NextFunction) => {
        const hotels = await this.repository.find({relations: ["city"]})

        this.router.get('/', this.all)

        response.send(hotels)
    }
}