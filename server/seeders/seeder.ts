import { plainToClass } from 'class-transformer'
import { Connection, getRepository } from 'typeorm'
import { Config } from '../entity/config'
import { Room } from '../entity/room'
import { Tag } from '../entity/tag'

import tags from './tags.json'
import rooms from './rooms.json'

const seedDatabase = async (connection: Connection) => {
  const dbIsSeeded = await getRepository(Config).findOne('seeded')

  if (dbIsSeeded === undefined) {
    // const tagsORM = plainToClass(Tag, tags)

    // await connection.manager.save(tagsORM)

    const roomsORM = plainToClass(Room, rooms)
    await connection.manager.save(roomsORM)

    const seeded = new Config()
    seeded.key = 'seeded'
    seeded.value = 'true'

    await connection.manager.save(seeded)
    console.log('Database has been seeded')
  } else {
    console.log('The database has already been seeded')
  }
}

export default seedDatabase
