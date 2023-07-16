import {Schema} from 'mongoose'
import { connection } from '../mongoConnection'

/**
 * Уровень доступа пользователя, определяющий права работы с порталом
 */
const AccessLevelSchema = new Schema({
     value: [{type: Number}],
})

const AccessLevel = connection.model('AccessLevel', AccessLevelSchema)

export default AccessLevel