import { NextFunction, request, Request, Response, Router } from "express"
import { auth } from "firebase-admin";
import { getAuth } from 'firebase-admin/auth'



export class AuthController {
    public router = Router()

    constructor() {
        this.router.post('/signup', this.signup)
    }

    signup = async (request: Request, response: Response, next: NextFunction) => {
        const {
            email, password, name
        } = request.body;
        try {
            const user = await auth().createUser({
                email, password,
                displayName: name,

            });

            //Users with howest email get admin rights
            if (user.email && user.email.endsWith('@howest.be')) {
                const customClaims = {
                    admin: true
                }
                try {
                    await getAuth().setCustomUserClaims(user.uid, customClaims)
                } catch (error) {
                    console.log(error);

                }
            }

            return response.json(user);
        } catch (error) {
            response.status(400);
            return response.json(error)
        }
    }

}