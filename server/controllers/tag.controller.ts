import { NextFunction, Request, Router, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Tag } from "../entity/tag";


export class TagController {
    public router = Router()

    public repository: Repository<Tag>

    constructor() {
        this.repository = getRepository(Tag)
        this.router.get('/', this.all)
    }

    all = async(request: Request, response: Response, next: NextFunction) => {
        const tags = await this.repository.find()

        this.router.get('/', this.all)

        response.send(tags)
    }
}