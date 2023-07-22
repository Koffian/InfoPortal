import { NextFunction, Request, Response } from "express"
import ContentTypes from "../common/ContentTypes"
import Post from "#server/models/Post"

/** Загрузить пост сообщетсва в MongoDb */
function UploadPost(req : Request, res : Response, next : NextFunction){
     const {title, content, createdBy} = req.body
     if (title === undefined){
          console.log("Пользователь не предоставил заголовок")
          return res.status(400).json({message: "Отсутствует заголовок поста"})
     }
     if (content === undefined){
          console.log("Пользователь не предоставил контент поста")
          return res.status(400).json({message: "Отсутствует контент поста"})
     }
     if (createdBy === undefined){
          console.log("Не указано авторство поста")
          return res.status(400).json({message: "Отсутствует авторство поста"})
     }

     /** передать дальше управление контроллеру */
     
     next()
}

/**
 * Проверить запрос загрузки файла определённого типа в файловое хранилише
 * @param {Number} UploadedContentType Ожидаемый тип по данному эндпоинту
 */
function UploadMiddleware (UploadedContentType : Number) {
     return function (req : Request, res : Response, next : NextFunction) {
          try {         

          if (UploadedContentType === ContentTypes.POST)
          {
               console.log("Пытаемся загрузить новый пост сообщества")
               return UploadPost(req, res, next)
          }
     }
     catch (e) {
          console.log("Ошибка middleware загрузки файлов: " + e)
          return res.status(403).json({error: {message: "Не удалось Загрузить файл: " + e}})
     }
     }
}

export default UploadMiddleware