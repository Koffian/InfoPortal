import { NextFunction, Request, Response } from "express"
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
 * Проверить результат сохранения файла, загруженного в multipart/form-data виде в GridFS
 */
function GridFsMiddleware (req : Request, res : Response, next : NextFunction) {
     try {         
          console.log("Сохранён файл: ")
          console.log(req.file)
          return res.status(201).json({message: "Успешно создан файл.", file: req.file})
     }
     catch (e) {
          console.log("Ошибка сохранения файла в хранилище GridFs: " + e)
          return res.status(403).json({error: {message: "Не удалось Загрузить файл: " + e}})
     }
}

export default GridFsMiddleware