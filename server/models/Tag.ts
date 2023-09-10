import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'
import { ObjectId } from 'mongodb'

const TagSchema = new Schema({
     name: {type: String, unique: true, required: true},                    ///< Название тега
     description: {type: String, unique: true, default: "Описание этого тега не было заполнено при создании"},
     referencesArray: [ObjectId],  /// Массив связанных элементов по ID
     referenceCount: {type: Number, default: 0}                             /// Счетчик связанных элементов
})

/** Тег постов.  */
const Tag = connection.model("Tag", TagSchema)
export default Tag