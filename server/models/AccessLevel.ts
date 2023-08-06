import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'

const AccessLevelSchema = new Schema({
     value: {type: Number, required: true},
})

/** Уровень доступа пользователя, определяющий права работы с порталом */
const AccessLevel = connection.model('AccessLevel', AccessLevelSchema)

export default AccessLevel