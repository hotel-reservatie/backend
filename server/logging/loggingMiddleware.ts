import { NextFunction, Request, Response } from "express";
import { MiddlewareFn } from "type-graphql";
import { authorizedRequest } from "../models/request";



export const LogAccess = (request: authorizedRequest, response: Response, next: NextFunction) => {


    // console.log(request);

    const username: string = request.currentUser ? request.currentUser.name : "guest"

    const operationName = getOperationName(request)

    console.log(`Request from user: ${username} -> ${operationName}`);

    return next();
};

export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
    try {
        return await next()
    } catch (err) {

        const request = context.request as authorizedRequest

        console.log(`Operation ${getOperationName(request)} failed. ${err}`)

        throw err;
    }
};

const getOperationName = (request: authorizedRequest) => {
    if (request.method == "POST" && request.body.operationName) {
        return request.body.operationName
    }
    return request.originalUrl
}
