import { Request, Response } from "express"
import Tag from "../models/Tag";
import { API_ErrorResponse, API_Response, KnownErrors, StatusCodes } from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { ObjectId } from "mongodb";
import { GetRequestorReactionFlag } from "../common/helpers/KarmaHelpers";


/* Рекурсивно зарезолвить реплаи к комментарию по ID и вернуть список
  return replyList - Список ответных комментариев
*/
async function ResolveCommentReplies(replyIDList: Array<any>)
{
     let resolvedReplyList: any = []
     // Не продолжать если список реплаев пуст
     if (replyIDList.length === 0 )
     {
          return resolvedReplyList
     }
     
     for (const replyID of replyIDList)
     {
          /// 1. Найти реплаи n-го уровня вложенности
          const reply = await Comment.findById(replyID)
          if (!reply){ throw Error("Не найден коммент-реплай с ID: " + replyID);}
          
          /// 2. Зарезолвить следующий уровень реплаев
          const nextRepliesList = await ResolveCommentReplies(reply.replies)

          resolvedReplyList.push({body: reply.body, replies: nextRepliesList})
     }

     return resolvedReplyList
}

/** Контролер управления тегами */
class CommentController {
     /*Создать комментарий и связать его с целью */
     async CreateComment(req : any, res : Response){
          try 
          {
               const targetIDParam = req.params.id
               if (targetIDParam === undefined || targetIDParam.length !== 24)
               {
                    console.log("Невалидное ID цели, которую нужно прокомментировать")
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невалидное ID цели, которую нужно прокомментировать"
                    ));
               }

               const postTarget = await Post.findById(targetIDParam);

               console.log("recieved body:")
               console.log(req.body.body[0].contentType)
               /* Комментируем пост */
               if (postTarget) {

                    const newComment = await Comment.create({createdBy:req.requestorUserId, body: req.body.body})
                    postTarget.comments.push(newComment.id)

                    await postTarget.save()

                    return ReturnAPIResponse(res, new API_Response(
                         StatusCodes.Success,
                         newComment,
                         "Успешно оставлен комментарий к посту: "
                    )); 
               }
               /* Комментируем другой комментарий */
               else
               {
                    const commentTarget = await Comment.findById(targetIDParam);
                    if (commentTarget) {
                         const newComment = await Comment.create({createdBy:req.requestorUserId, body: req.body.body});
                         commentTarget.replies.push(newComment.id)

                         await commentTarget.save()

                         return ReturnAPIResponse(res, new API_Response(
                              StatusCodes.Success,
                              newComment,
                              "Успешно оставлен комментарий к другому комментарию: "
                         )); 
                    }
                    else{
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.BadRequest,
                              KnownErrors.BadParams,
                              "Не найден ни пост, ни комментарий с таким ID: " + targetIDParam
                         )); 
                    }
               }
          }
          catch (e) {
               console.log("Ошибка создания тэга: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "ошибка создания тега: " + e
               ));
          }
     }

     /** Получить информацию об одном комментарии */
     async GetComment(req : Request, res : Response)
     {
          const commentIDParam = req.params.id
          if (commentIDParam === undefined || commentIDParam.length != 24)
          {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.BadRequest,
                    KnownErrors.BadParams,
                    "Невалидное ID комментария (undefined или не длины 24)"
               ));
          }

          const comment = await Comment.findById(commentIDParam)
          
          if (!comment)
          {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.NotFound,
                    KnownErrors.NotFound,
                    "Не найден комментарий с ID: " + commentIDParam
               ));
          }

          const reactionFlag = await GetRequestorReactionFlag(req, comment.id)

          return ReturnAPIResponse(res, new API_Response(
               StatusCodes.Success,
               {comment: comment, reactionFlag: reactionFlag},
               "Возвращена информация о комментарии"
          ))
     }

     async EditComment(req : Request, res : Response){
          try {
               
               const tagNameQuery = req.query.name
               const tagDescriptionQuery = req.query.description

               if (tagNameQuery === "") 
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невозможно оставить пустное название у тега. Укажите название"
                    ));
               }

               const candidateTag: any = await Tag.findOne({name: tagNameQuery})
               if (candidateTag !== null)
               {
                    return ReturnAPIResponse(res, new API_Response(
                         StatusCodes.InternalError,
                         candidateTag,
                         "Пост с названием " + tagNameQuery + " уже существует"
                    ));
               }

               const updatedTag: any =  await Tag.findByIdAndUpdate(req.params.id, {name: tagNameQuery, description: tagDescriptionQuery})

               if (updatedTag === null)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Тег не найден, не удалось обновить тег: "
                    ));
               }

               console.log("Обновлен тэг: " + updatedTag)

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    updatedTag,
                    "Успешно Обновлен тег: "
               ));
          }
          catch (e) {
               console.log("Ошибка создания тэга: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "ошибка создания тега: " + e
               ));
          }
     }

     async DeleteComment(req: Request, res: Response)
     {

     }

     /**Построить дерево комментариев для данной цели */
     async AggregateComments(req: any, res: Response)
     {
          try 
          {
               const targetIDParam = req.params.id
               if (targetIDParam === undefined || targetIDParam.length !== 24)
               {
                    console.log("Невалидное ID цели, для которой нужна агрегация")
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невалидное ID цели, для которой нужна агрегация"
                    ));
               }

               const postTarget = await Post.findById(targetIDParam);

               /* Агрегируем комменты поста */
               if (postTarget) {
                    
                    const commentIDList = postTarget.comments                    
                    // Deep-first поиск
                    
                    let aggregatedComments: any = []
                    //1. Зарезолвить коммент по ID
                    for (const commentID of commentIDList)
                    {
                         const comment: any = await Comment.findById(commentID)

                         //2. Рекурсивно резолвить реплаи коммента
                         const repliesList = await ResolveCommentReplies(comment.replies)
                         aggregatedComments.push({body: comment, replies: repliesList})
                    }

                    return ReturnAPIResponse(res, new API_Response(
                         StatusCodes.Success,
                         aggregatedComments,
                         "Собраны комментарии для поста '" + postTarget.title + "', " + targetIDParam
                    )); 
               }

               /* Агрегируем для другого комментария */
               else
               {
                    const commentTarget = await Comment.findById(targetIDParam);
                    if (commentTarget) {

                         let aggregatedComments: any = []
                         for (const replyID of commentTarget.replies)
                         {
                              const comment: any = await Comment.findById(replyID)
     
                              //2. Рекурсивно резолвить реплаи коммента
                              const repliesList = await ResolveCommentReplies(comment.replies)
                              aggregatedComments.push({id: replyID, body: comment, replies: repliesList})
                         }

                         return ReturnAPIResponse(res, new API_Response(
                              StatusCodes.Success,
                              aggregatedComments,
                              "Собраны комментарии для комментария с ID: " + targetIDParam + " от автора " + commentTarget.createdBy
                         )); 
                    }
                    else
                    {
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.BadRequest,
                              KnownErrors.BadParams,
                              "Не найден ни пост, ни комментарий с таким ID: " + targetIDParam
                         )); 
                    }
               }
          }
          catch (e) {
               console.log("Ошибка аггрегации комментариев для поста/коммента: " + req.params.id)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка аггрегации комментариев для поста/коммента: " + req.params.id
               ));
          }
     }
}

var controller = new CommentController()
export { controller }
