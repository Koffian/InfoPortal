import {Schema} from 'mongoose'
import { connection } from '../MongoConnection'
import { ObjectId } from 'mongodb'

const PostSchema = new Schema({
     title: {type: String, unique: true, required: true},             ///< Главный заголовок поста
     type: {type: Number, unique: true, required: true},              ///< Тип публикации (статья/новость)
     format: {type: Number, unique: true, required: true},            ///< Формат публикации
     createdBy: {type: ObjectId, ref: 'User', required: true},                       ///< Id создателя
     body: [
          {
               type: {type: Number},
               content: Schema.Types.Mixed
          }
     ],                         ///< Содержимое поста
     creationDate: {type: Date, default: new Date(), required: true},                      ///< Дата создания поста
     modifyDate: {type: Date, default: new Date(), required: true},                        ///< Дата последнего изменения поста
     tags: [ObjectId],                                                ///< Список привязанных тегов
     comments: [ObjectId],                                            ///< Список комментариев первой вложенности
     karmaCounter: {type: Number, default: 0, required: true},                        ///< Счётчик кармы
     isRestricted: {type: Boolean, default: false, required: true}    ///< Заблокирован модератором/админом или нет
})

/** Пост сообщества.  */
const Post = connection.model("Post", PostSchema)
export default Post