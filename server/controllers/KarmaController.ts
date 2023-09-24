import { Request, Response } from "express"
import { API_ErrorResponse, API_Response, KnownErrors, StatusCodes } from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";
import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import { ReactToElement, GetRatingMethodCode} from "../common/helpers/KarmaHelpers"


/** Контролер управления реакциями пользователей на контент портала */
class KarmaController {
     /*Создать реакцию пользователя на контент*/
     async ReactToContent(req : any, res : Response){
          try 
          {
               const targetIDParam = req.params.id
               const ratingMethodCode = GetRatingMethodCode(req.query.ratingMethod)
               if (targetIDParam === undefined || targetIDParam.length !== 24)
               {
                    console.log("Невалидное ID цели, на которую нужно оставить реакцию")
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невалидное ID цели, на которую нужно оставить реакцию"
                    ));
               }

               if (ratingMethodCode === undefined)
               {
                    console.log("Невалидный метод оценивания элемента")
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невалидный метод оценивания элемента"
                    ));
               }

               const postTarget = await Post.findById(targetIDParam);
               const reactedUser = await User.findById(req.requestorUserId)
               /* Оцениваем пост */
               if (postTarget) {
                    const reactionResult = await ReactToElement(reactedUser, postTarget, ratingMethodCode)
                    if (reactionResult === 1)
                    {
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.AlreadyExists,
                              KnownErrors.AlreadyExists,
                              "Такая реакция уже существует."
                         )); 
                    }
                    return ReturnAPIResponse(res, new API_Response(
                         StatusCodes.Success,
                         reactedUser?.reactionList,
                         "Успешно оставлена реакция на пост: "
                    )); 
               }
               /* Оцениваем другой комментарий */
               else
               {
                    const commentTarget = await Comment.findById(targetIDParam);
                    if (commentTarget) {
                         const reactionResult = await ReactToElement(reactedUser, commentTarget, ratingMethodCode)
                         if (reactionResult === 1)
                         {
                              return ReturnAPIResponse(res, new API_ErrorResponse(
                                   StatusCodes.AlreadyExists,
                                   KnownErrors.AlreadyExists,
                                   "Такая реакция уже существует."
                              )); 
                         }
                         return ReturnAPIResponse(res, new API_Response(
                              StatusCodes.Success,
                              reactedUser?.reactionList,
                              "Успешно оставлена реакция на другой комментарий. "
                         )); 
                    }
                    /// Может быть антипаттерн if-else. 
                    else{
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.BadRequest,
                              KnownErrors.BadParams,
                              "Невозможно оставить реакцию. Не найден ни пост, ни комментарий с таким ID: " + targetIDParam
                         )); 
                    }
               }
          }
          catch (e) {
               console.log("Ошибка создания реакции " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "ошибка создания реакции: " + e
               ));
          }
     }
}
var controller = new KarmaController()
export { controller }
