import { NextFunction, request, Request, Response, Router } from 'express'
import { auth } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getRepository, Repository } from 'typeorm'
import { User } from '../entity/user'

export class AuthController {
  public router = Router()

  public userRepository: Repository<User> = getRepository(User)

  constructor() {
    this.router.post('/signup', this.signup)
  }

  signup = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password, name } = request.body


    if (email && password && name) {
      try {
        const user = await auth().createUser({
          email,
          password,
          displayName: name,
        })

        const customClaims = {
          admin: false,
        }
        //Users with howest email get admin rights
        if (user.email && user.email.endsWith('@howest.be')) {
          customClaims.admin = true
        }
        try {
          await getAuth().setCustomUserClaims(user.uid, customClaims)
        } catch (error) {
          console.log(error)
        }

        const u: User = new User()

        u.userId = user.uid
        u.userName = name
        u.email = email
        u.phone = user.phoneNumber
        u.admin = customClaims.admin

        console.log(u);
        console.log(user);



        await this.userRepository.save(u)
          .then(() => console.log("Added new user to database: ", u))
          .catch((e) => {
            console.log(`Could not insert user: ${e}`);
          })

        return response.json(user)
      } catch (error) {
        response.status(400)
        return response.json(error)
      }
    }

    response.status(400)
    return response.json({"error": "Bad request"})
  }
}
