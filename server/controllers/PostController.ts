import { Document, ObjectId } from "mongodb";
import { gfs, gridfsBucket, upload } from "../MongoConnection";
import { Request, Response } from "express"
import Post from "../models/Post";
/**
 * Контролер для работы с постами сообщества (т.к. записи о постах меньше 16 Мб, пока-что не планируется их хранение в GridFS)
 */
class PostController {
     async CreateNewPost(req : Request, res : Response){
          try {

               const createdPost =  await Post.create({ title: req.body.title, content: req.body.content, createdBy: req.body.createdBy})

               console.log("Создан пост: " + createdPost)
               return res.status(200).json({message: "Создан новый пост " + createdPost})
               }
          catch (e) {
               console.log("ошибка создания поста: " + e)
          }
     }

     async GetAllPostsURLS(req : Request, res : Response){
          try {

               const postArray = await Post.find()

               // Построить массив url'ов изображений с метадатой
               const postsURLAndExtra = postArray.map((file) => ({
                    title: file.title,
                    url: `/post/${file._id}`
               }));

               return res.status(200).json({postsURLAndExtra})
               }
          catch (e) {
               console.log("ошибка получения списка постов: " + e)
          }
     }

     async GetPostByURL(req : Request, res : Response){
          try {
               const postFound = await Post.find({_id: req.params.id})

               if (postFound === undefined)
               {
                    return (res.status(403).json("Не найден пост с данным id"))
               }

               return res.status(200).json(postFound)
               }
          catch (e) {
               console.log("ошибка получения поста: " + e)
          }
     }
}

var controller = new PostController()
export { controller }