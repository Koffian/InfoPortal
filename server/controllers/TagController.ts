import { Request, Response } from "express"
import Tag from "../models/Tag";

/** Контролер управления тегами */
class TagController {
     async CreateNewTag(req : Request, res : Response){
          try {
               
               const createdTag =  await Tag.create({ name: req.body.name, description: req.body.content, createdBy: req.body.description})

               console.log("Создан новый тэг: " + createdTag)
               return res.status(200).json({message: "Создан новый тэг: " + createdTag})
               }
          catch (e) {
               console.log("Ошибка создания тэга: " + e)
               return res.status(400).json({message: "Ошибка создания тэга: " + e})
          }
     }
}

var controller = new TagController()
export { controller }
