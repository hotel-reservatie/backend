import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '.'

async function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const headerToken = request.headers.authorization


    if (!headerToken) {
        console.log("Anonymous request");
        
        next()
        return
    }

    if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
        return response.send({ message: 'Invalid token' }).status(401)
    }

    const token: string = headerToken.split(' ')[1]

    verifyToken(token)
        .then(claims => {
            ; (request as any).currentUser = claims
            console.log({ claims })
            next()
        })
        .catch(error => {
            console.log(error)

            return response.send({ message: 'Could not authorize' }).status(403)
        })
}

export default authMiddleware