import { Document, ObjectId } from "mongodb";
import { gfs, gridfsBucket, upload } from "../MongoConnection";
import { Request, Response } from "express"
import Post from "../models/Post";
import { GetSortingMethod } from "../common/types/SortingMethods";
import { API_ErrorResponse, API_Response, KnownErrors, StatusCodes } from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";
import { CheckPostModifyableFields } from "../common/helpers/CheckModifiyableFields";
import { PostFormats } from "../common/PostTypes";
import AccessLevel from "../common/AccessLevel";
import Tag from "../models/Tag";
/**
 * Контролер для работы с постами сообщества (т.к. записи о постах меньше 16 Мб, пока-что не планируется их хранение в GridFS)
 */
class PostController {
     async GetPosts(req : any, res : any){
          try {

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

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    postArray,
                    "Отдан список постов"
               ))
               }
          catch (e) {
               console.log("ошибка получения списка постов: " + e)

               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Внутрення ошибка сервера при получении списка постов из БД: " + e
               ));
          }
     }

     async GetPostMatches(req: Request, res: Response){
          
     }

     async GetPostByURL(req : Request, res : Response){
          try {
               console.log("получаем пост по url")
               const postFound = await Post.find({_id: req.params.id})

               if (postFound === undefined || postFound === null || !postFound.length)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден пост с URL " + req.params.id
                    ));
               }
               
               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    postFound,
                    "Найден существующий пост "
               ));
          }
          catch (e) {
               console.log("ошибка получения поста: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Внутрення ошибка сервера при получении поста: " + e
               ));
          }
     }

     async UpdatePost(req: any, res: Response)
     {
          try 
          {
               const postFound: any = await Post.find({_id: req.params.id})
               if (typeof postFound === 'undefined' || postFound === null)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден пост с URL " + req.params.id
                         ));
               }

               if (postFound.createdBy === req.requestorUserId)
               {
                    req.ownershipFlag = true;
               }
               else
               {
                    req.ownershipFlag = false
                    if (req.accessLevel === AccessLevel.User)
                    {
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.Forbidden,
                              KnownErrors.Forbidden, 
                              "Обычный пользователь не может редактировать чужие посты"
                         ));
                    }
               }
               CheckPostModifyableFields(req)
               
               for (const [field, value] of Object.entries(req.body))
               {
                    postFound[field] = value
               }

               await Post.findByIdAndUpdate(req.params.id, req.body);

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    req.body,
                    "Обновлены данные о посте:"
                    ));
                    
          } 
          catch (error)
          {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.BadParams,
                    "Ошибка обновления поста: " + error
               ));
          }
     }

     async CreatePost(req: any, res: Response)
     {
          try{

               req.ownershipFlag = true
               CheckPostModifyableFields(req)
               
               const createdFields = req.body
               
               let newPost = new Post({
                    title: createdFields.title,
                    type: createdFields.type,
                    format: createdFields.format,
                    createdBy: req.requestorUserId,
                    body: createdFields.body,
                    tags: createdFields.tags
               })
  
               for (const tagInfo of newPost.tags)
               {
                    const tag = await Tag.findById(tagInfo.tagId) 
                    if (!tag)
                    {
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.BadRequest,
                              KnownErrors.BadParams,
                              "Не удалось создать пост. Не найдет указанный тег с ID: " + tagInfo.tagId
                              ))
                    }
                    tagInfo.name = tag.name
               }

               await newPost.save()
               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    newPost,
                    "Успешно создан новый пост."
                    ))
          }
          catch (error) {
               console.log("Возникла ошибка при создании поста: " + error);
               
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Возникла ошибка при создании поста: " + error
               ))
          }
     }

     async DeletePost(req: Request, res: Response)
     {
          try 
          {    
               const postFound = await Post.find({_id: req.params.id})
               if (typeof postFound === 'undefined' || postFound === null)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден пост с URL " + req.params.id
                    ));
               }
               await Post.deleteOne({_id: req.params.id})

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    undefined,
                    "Пост успешно удалён"
               ));
          } 
          catch (e) {
               console.log("Не удалось удалить пост :" + e);
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Не удалось удалить пост " + e
               ));
          }
     }
}

var controller = new PostController()
export { controller }
