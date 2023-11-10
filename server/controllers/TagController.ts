import { Request, Response } from "express"
import Tag from "../models/Tag";
import { API_ErrorResponse, API_Response, KnownErrors, StatusCodes } from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";
import Post from "../models/Post";

/** Контролер управления тегами */
class TagController {
     async CreateNewTag(req : Request, res : Response){
          try {
               
               const tagNameQuery = req.query.name
               const tagDescriptionQuery = req.query.description

               if (tagNameQuery === "") 
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невозможно создать тег без названия. Укажите название"
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

               const createdTag =  await Tag.create({ name: tagNameQuery, description: tagDescriptionQuery})
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

     async UpdateTag(req : Request, res : Response){
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

     async DeleteTag(req : Request, res : Response){
          try {
               const tagIdQuery = req.params.id

               if (tagIdQuery === "") 
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Невозможно оставить пустное название у тега. Укажите название"
                    ));
               }
               console.log(tagIdQuery)
               const tagFound: any = await Tag.findById(tagIdQuery)
               const deletedTag: any = await Tag.deleteOne({_id: tagIdQuery})

               if (!tagFound)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Тег не найден, не удалось удалить тег: "
                    ));
               }

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    tagFound,
                    "Успешно удалён тег: "
               ));
          }
          catch (e) {
               console.log("Ошибка удаления тэга: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "ошибка удаления тега: " + e
               ));
          }
     }

     async FindTags(req: any, res: Response)
     {
          try {
               const tagNameQuery = req.query.name || ""
               const tagSearchLimit = parseInt(req.query.searchLimit) || 10

               const tagsFound = await Tag.find({ "name" : { $regex: tagNameQuery, $options: 'i' } }).limit(tagSearchLimit)

               const tagsToReturn = {
                    foundAmmount: tagsFound.length,
                    tags: tagsFound
               }

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    tagsToReturn,
                    "Отдан список тегов: "
               ));
          }
          catch (e) {
               console.log("Ошибка поиска по тэгам: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошбика поиска по тегам: " + e
               ));
          }
     }

     async PushTag(req : Request, res: Response)
     {
          try {
               const targetIDParam = req.params.id
               const tagIDQuery = req.query.tagID

               // Проверка path и query параметров
               if (targetIDParam === undefined || targetIDParam.length != 24)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Некорректное ID элемента: " + targetIDParam
                    ));
               }

               if (tagIDQuery === undefined || tagIDQuery.length != 24)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Некорректное ID тега: " + tagIDQuery
                    ));
               }

               /// Пока-что захардкожен пост
               let targetFound = await Post.findById(targetIDParam)
               let tagFound = await Tag.findById(tagIDQuery)

               if (!targetFound)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден элемент с ID: " + targetIDParam
                    ));
               }

               if (!tagFound)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден существующий тэг с ID: " + targetIDParam
                    ));
               }

               for (const tag of targetFound.tags)
               {
                    if (tag.name === tagFound.name)
                    {
                         return ReturnAPIResponse(res, new API_ErrorResponse(
                              StatusCodes.AlreadyExists,
                              KnownErrors.AlreadyExists,
                              "Такой тег уже связан с постом. abort "
                         ));
                    }
               }

               /// Добавляем тег к элементу
               console.log("Пушим")
               console.log({tagId: tagFound.id, name: tagFound.name})
               targetFound.tags.push({tagId: tagFound.id, name: tagFound.name})
               tagFound.referencesArray.push(targetFound.id)
               tagFound.referenceCount++

               await targetFound.save()
               await tagFound.save()

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    {target: targetFound, tag: tagFound},
                    "Элемент связан с тегом: "
               ));
          }
          catch (e) {
               console.log("Ошбика связывания тега с элементом: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка связывания тега с элементом: " + e
               ));
          }
     }

     async PopTag(req : Request, res: Response)
     {
          try {
               const targetIDParam = req.params.id
               const tagIDQuery = req.query.tagID

               // Проверка path и query параметров
               if (targetIDParam === undefined || targetIDParam.length != 24)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Некорректное ID элемента: " + targetIDParam
                    ));
               }

               if (tagIDQuery === undefined || tagIDQuery.length != 24)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Некорректное ID тега: " + tagIDQuery
                    ));
               }

               /// Пока-что захардкожен пост
               let targetFound = await Post.findById(targetIDParam)
               let tagFound = await Tag.findById(tagIDQuery)

               if (!targetFound)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден элемент с ID: " + targetIDParam
                    ));
               }

               if (!tagFound)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден существующий тэг с ID: " + targetIDParam
                    ));
               }

               /// 1. Модификация тега
               /// Открепляем тег от элемента
               // targetFound.tags.er
               let index = tagFound.referencesArray.indexOf(targetFound.id, 0)
               if (index > -1){
                    tagFound.referencesArray.splice(index, 1)
               }
               tagFound.referenceCount--

               /// 2. Модификация поста
               
               index = targetFound.tags.indexOf(tagFound.id, 0)
               if (index > -1){
                    targetFound.tags.splice(index, 1)
               }

               await targetFound.save()
               await tagFound.save()

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    {target: targetFound, tag: tagFound},
                    "Удалена связь тега с элементом: "
               ));
          }
          catch (e) {
               console.log("Ошбика отвязываения тега от элемента: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка связывания тега от элемента: " + e
               ));
          }
     }

     async GetTagByID(req : Request, res: Response)
     {
          try {
               const tagIDParam = req.params.id

               if (tagIDParam === undefined || tagIDParam.length != 24)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Некорректное ID искомого тега: " + tagIDParam
                    ));
               }

               /// Пока-что захардкожен пост
               let tagFound = await Tag.findById(tagIDParam)

               if (!tagFound)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден существующий тэг с ID: " + tagIDParam
                    ));
               }

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    tagFound,
                    "Найден существующий тег"
               ));
          }
          catch (e) {
               console.log("Ошбика связывания тега с элементом: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка связывания тега с элементом: " + e
               ));
          }
     }
}

var controller = new TagController()
export { controller }
