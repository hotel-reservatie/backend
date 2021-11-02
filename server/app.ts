// app.ts
import express, { NextFunction, Request, Response } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'
import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm'
import { createDatabase } from 'typeorm-extension'
import { RoomController } from './controllers/room.controller'
import { TagController } from './controllers/tag.controller'
import { ReviewResolver } from './resolvers/reviewResolver'
import { RoomResolver } from './resolvers/roomResolver'
import seedDatabase from './seeders/seeder'
import admin, { auth } from 'firebase-admin'
import dotenv from 'dotenv'



  ; import { initializeApp } from 'firebase-admin/app'
import { AuthController } from './controllers/auth.controller'
import { customAuthChecker } from './auth/customchecker'
import authMiddleware from './auth/firebaseAuthMiddleware'
import { FavoriteResolver } from './resolvers/favoriteResolver'
import { ReservationResolver } from './resolvers/reservationResolver'
(async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions() // This line will get the connection options from the typeorm
  createDatabase({ ifNotExist: true }, connectionOptions)
    .then(() => console.log('Database created successfully!'))
    .then(createConnection)
    .then(async (connection: Connection) => {
      dotenv.config()
      initializeApp({
        credential: admin.credential.applicationDefault()
      })
      seedDatabase(connection)

      // APP SETUP
      
      const roomController = new RoomController()
      const tagController = new TagController()
      const authController = new AuthController()
      const app = express(),
        port = process.env.PORT || 3000



      // MIDDLEWARE
      app.use(express.json()) // for parsing application/json
      app.use(authMiddleware)
      app.use('/rooms', roomController.router)
      app.use('/tags', tagController.router)
      app.use('/auth', authController.router)


      // ROUTES
      app.get('/', (request: Request, response: Response) => {
        response.send(`Welcome, just know: you matter!`)
      })
      /**
       *
       * @description create the graphql schema with the imported resolvers
       */
      let schema: GraphQLSchema = {} as GraphQLSchema

      await buildSchema({
        resolvers: [RoomResolver, ReviewResolver, FavoriteResolver, ReservationResolver],
        authChecker: customAuthChecker
      }).then(_ => {
        schema = _
      })

      // GraphQL init middleware
      app.use(
        '/v1/', // Url, do you want to keep track of a version?
        graphqlHTTP((request, response) => ({
          schema: schema,
          context: { request, response },
          graphiql: true,
        })),
      )

      // APP START
      app.listen(port, () => {
        console.info(`\nServer 👾 \nListening on http://localhost:${port}/v1/graphql`)
      })
    })
    .catch(error => console.error(error)) // If it crashed anywhere, let's log the error!
})()
