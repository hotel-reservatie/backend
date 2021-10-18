// app.ts
import express, { Request, Response } from 'express'
import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm'
import { createDatabase } from 'typeorm-extension'
import { RoomController } from './controllers/room.controller'
;import { TagController } from './controllers/tag.controller';
import seedDatabase from './seeders/seeder';
(async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions() // This line will get the connection options from the typeorm
  createDatabase({ ifNotExist: true }, connectionOptions)
    .then(() => console.log('Database created successfully!'))
    .then(createConnection)
    .then(async (connection: Connection) => {

      seedDatabase(connection)
      // APP SETUP
      const roomController = new RoomController()
      const tagController = new TagController()
      const app = express(),
        port = process.env.PORT || 3000

      // MIDDLEWARE
      app.use(express.json()) // for parsing application/json
      app.use('/rooms', roomController.router)
      app.use('/tags', tagController.router)

      // ROUTES
      app.get('/', (request: Request, response: Response) => {
        response.send(`Welcome, just know: you matter!`)
      })

      // APP START
      app.listen(port, () => {
        console.info(`\nServer 👾 \nListening on http://localhost:${port}/`)
      })
    })
    .catch(error => console.error(error)) // If it crashed anywhere, let's log the error!
})()
