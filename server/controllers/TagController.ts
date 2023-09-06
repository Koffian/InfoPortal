import { Request, Response } from "express"
import Tag from "../models/Tag";
import { API_ErrorResponse, API_Response, KnownErrors, StatusCodes } from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";

/** Контролер управления тегами */
class TagController {
     async CreateNewTag(req : Request, res : Response){
          try {
               
               const createdTag =  await Tag.create({ name: req.body.name, description: req.body.content, createdBy: req.body.description})
               console.log("Создан новый тэг: " + createdTag)

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    createdTag,
                    "Успешно создан новый тег: "
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
}

var controller = new TagController()
export { controller }
