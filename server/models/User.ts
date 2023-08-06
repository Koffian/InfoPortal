import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'
import { ObjectId } from 'mongodb'

const UserSchema = new Schema({
     username: {type: String, unique: true, required: true},     ///< Логин/никнейм (нет разделения для простоты)
     password: {type: String, required: true},                   ///< Пароль захешированный
     access: {type: Number, ref: 'AccessLevel'},                 ///< Роль в системе
     bannedUntil: {type: Date},                                  ///< Забанен до какого
     mutedUntil: {type: Date},                                   ///< До какого замучен
     subscribedTo: [ObjectId],                                   ///< На кого подписан
     postsCreatedList: [ObjectId]                                ///< Список созданных постов
})

const User = connection.model("User", UserSchema)
export default User