import { Document, ObjectId } from "mongodb";
import { gfs, gridfsBucket, upload } from "../MongoConnection";
import { Request, Response } from "express"
import Post from "../models/Post";
import { Network } from "../common/Network";
import { GetSortingMethod } from "../common/types/SortingMethods";
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

     async GetPosts(req : any, res : any){
          try {

               if (typeof(req.query.page) === typeof(String))
               {
                    return;
               }
               const page = parseInt(req.query.page) || 1;
               const perPage = parseInt(req.query.per_page) || 10;
               const sortingMethod: string = GetSortingMethod(req.query.order_by);

               const postsFound = await Post.find().skip(page * perPage - perPage).limit(perPage).sort(sortingMethod);
               const foundAmount = postsFound.length;

               let postcards: any = postsFound.map(item => {
                    const {_id ,title, type, format, createdBy, tags, karmaCounter, isRestricted, creationDate} = item;
                    return {_id, title, type, format, createdBy, tags, karmaCounter, isRestricted, creationDate};
               });

               // Построить массив url'ов изображений с метадатой
               const postArray = {
                    foundAmount: foundAmount,
                    posts: postcards
               };

               console.log("Отдан список постов")
               return res.status(200).json({postArray})
               }
          catch (e) {
               console.log("ошибка получения списка постов: " + e)
          }
     }

     async GetPostMatches(req: Request, res: Response){
          
     }

     async GetPostByURL(req : Request, res : Response){
          try {
               console.log("получаем пост по url")
               const postFound = await Post.find({_id: req.params.id})

               if (typeof postFound === 'undefined' || postFound === null)
               {
                    return res.status(403).json("Не найден пост с данным id")
               }

               return res.status(200).json(postFound)
               }
          catch (e) {
               console.log("ошибка получения поста: " + e)
               res.status(400).json(e)
          }
     }

     async DeletePost(req: Request, res: Response){
          try 
          {    
               const postFound = await Post.find({_id: req.params.id})
               if (typeof postFound === 'undefined' || postFound === null)
               {
                    return res.status(403).json("Не найден пост с данным id")
               }
               await Post.deleteOne({_id: req.params.id})

               return res.status(200).json("Пост успешно удалён")
          } 
          catch (error) {
               console.log("Не удалось удалить пост: " + error);
               return res.status(400).json("Не удалось удалить пост: " + error)
          }
     }
}

var controller = new PostController()
export { controller }
