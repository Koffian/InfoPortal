import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'
import { ObjectId } from 'mongodb'

const CommentSchema = new Schema({
     createdBy: {type: ObjectId, required: true, ref: "User"},   ///< Id создателя коммента
     body: [
          {
               contentType: {type: Number, required: true},
               content: {type: Schema.Types.Mixed, required: true}
          }
     ],
     creationDate: {type: Date, required: true, default: Date()},                 ///< Дата создания комментария
     replies: [ObjectId],                                        ///< Список реплаев к комменту
     karmaCounter: {type: Number, required: true, default: 0},   ///< Счетчик кармы
     wasEdited: {type: Boolean, default: false},
     likedBy: [ObjectId]                                         ///< Кому понравился пост     
})

/** Комментарий участника сообщества.  */
const Comment = connection.model("Comment", CommentSchema)
export default Comment