// import { ObjectId } from "mongodb";
import { Document, ObjectId } from "mongodb";
import { connection } from "../MongoConnection";
import { gfs, gridfsBucket, upload } from "../MongoConnection";
import { Request, Response } from "express"
import { ReturnAPIResponse } from "../common/helpers/Responses";
import { API_Response, StatusCodes } from "../common/types/API_Responses";

/**
 * Контролер для работы с изображениями с помощью GridFS в MongoDB
 */
class StorageController {

     /** Не нужно сохранение в контроллере, т.к. middleware upload.single() сразу кладёт в хранилище GridFS */
     async UploadImage(req : Request, res : Response){
          try {
               if (!req.file) {
                    console.log("Не прикреплен файл")
                    return res.status(400).json({ message: 'No file received' });
               }

               console.log("id:")
               console.log(req.file.id);
               

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success, 
                    {id: req.file.id.toString(), data: req.file},
                    "Изображение успешно загружено"
               ));
               }
          catch (e) {
               console.log("ошибка загрузки изображения: " + e)
          }
     }

     async GetImage(req: Request, res: Response){
          try {
               if (req.params.id === undefined)
               {
                    console.log("Клиент не указал id изображения")
                    return res.status(400).json({message: "Не указан id изображения"})
               }

               const imageID = new ObjectId(req.params.id)

               console.log("Отдаём изображение с id: " + imageID)

               const imageFile = await gfs.files.findOne({ _id: imageID})!;

               if (!imageFile) {
                    return res.status(404).json({ message: 'Изображение не найдено' });
               }
              
               res.set('Content-Type', imageFile.contentType);
               console.log("Content-Type was set to: "+ imageFile.contentType)

               const downloadStream = gridfsBucket.openDownloadStream(imageID)

               return downloadStream.pipe(res);
          }
          catch (e) {
               console.log("Ошибка передачи изображения клиенту: " + e)
          }
     }

     /** Запросить информацию обо всех изображениях из- */
     async GetAllImages(req: Request, res: Response){
          try {
               console.log("Отдаём все изображения")
               const storageCollection = connection.collection('uploads.files')
               let imagesFound: any = await storageCollection.find().toArray()

               let imageCards: any = imagesFound.map((element: any) => {
                    const {_id, metadata } = element;
                    return {
                         id: _id,
                         originalName: metadata.originalName,
                         description: metadata.description
                    }
               })

               console.log(imageCards);
               res.status(200).json({imageCards})
          }
          catch (e) {
               console.log("Ошибка передачи изображения клиенту: " + e)
          }
     }

     async DeleteImage(req: Request, res: Response){
          try {
               res.status(200).json({message: "all right"})
          }
          catch (e) {
               console.log("Ошибка отображения изображений: " + e)
          }
     }
}

var controller = new StorageController()
export { controller }