import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'

/* Схема постов, размеченных по markdown.  */
const PostSchema = new Schema({
     title: {type: String, unique: true, required: true},
     content: {type: String, required: true},
     createdBy: {type: String, required: true}
})

const Post = connection.model("Post", PostSchema)
export default Post