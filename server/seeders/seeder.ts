import { plainToClass } from 'class-transformer'
import { Connection, getRepository, Repository } from 'typeorm'
import { Config } from '../entity/config'
import { Room } from '../entity/room'
import { Tag } from '../entity/tag'

import tags from './tags.json'
import rooms from './rooms.json'
import roomtypes from './roomTypes.json'
import roles from './roles.json'
import { RoomType } from '../entity/roomType'
import { Role } from '../entity/role'
import { auth } from 'firebase-admin'
import { User } from '../entity/user'
import { UserRecord } from 'firebase-admin/auth'


const seedDatabase = async (connection: Connection) => {


  const dbIsSeeded = await getRepository(Config).findOne('seeded')

  if (dbIsSeeded === undefined) {

    const tagsORM = plainToClass(Tag, tags)
    const roomsORM = plainToClass(Room, rooms)
    const roomTypeORM = plainToClass(RoomType, roomtypes)
    const rolesORM = plainToClass(Role, roles)




    await connection.manager.save(tagsORM)
    await connection.manager.save(roomTypeORM)
    await connection.manager.save(roomsORM)
    await connection.manager.save(rolesORM)

    const seeded = new Config()
    seeded.key = 'seeded'
    seeded.value = 'true'

    await connection.manager.save(seeded)
    console.log('Database has been seeded')
  } else {
    console.log('The database has already been seeded')
  }

  seedUsers();
}

const seedUsers = async () => {
  const userResult = await auth().listUsers()

  const userRepository = getRepository(User);
  userResult.users.map(async (userRecord: UserRecord) => {
    const databaseRecord = await userRepository.findOne(userRecord.uid)

    if (!databaseRecord) {
      const u = new User()

      u.userId = userRecord.uid
      u.userName = userRecord.displayName
      u.email = userRecord.email
      u.phone = userRecord.phoneNumber
      u.admin = userRecord.customClaims ? userRecord.customClaims.admin : false

      await userRepository.save(u)
        .then(() => console.log("Added new user to database: ", u))
        .catch((e) => {
          console.log(`Could not insert user: ${e}`);
        })



    }
  })
}

export default seedDatabase
