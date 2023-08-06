import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'
import { ObjectId } from 'mongodb'

const CommentSchema = new Schema({
     createdBy: {type: ObjectId, required: true, ref: "User"},   ///< Id создателя коммента
     creationDate: {type: Date, required: true},                 ///< Дата создания комментария
     replies: [ObjectId],                                        ///< Список реплаев к комменту
     karmaCounter: {type: Number, required: true, default: 0},   ///< Счетчик кармы
     likedBy: [ObjectId]                                         ///< Кому понравился пост     
})

/** Тег постов.  */
const Comment = connection.model("Comment", CommentSchema)
export default Comment