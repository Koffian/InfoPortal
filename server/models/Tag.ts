import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'

const TagSchema = new Schema({
     name: {type: String, unique: true, required: true},             ///< Название тега
     description: {type: String, unique: true}
})

/** Тег постов.  */
const Tag = connection.model("Tag", TagSchema)
export default Tag