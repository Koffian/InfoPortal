import { gfs } from "../MongoConnection";
import { Request, Response } from "express"


/**
 * Временный/черновой Функционал тестирования API.
 */
class DebugController {
     /** Получить список URL всех хранящихся изображений из БД. Удалить потом */
     async GetAllImageURLS(req: Request, res: Response){
          try {

               const files = await gfs.files.find({contentType: "image/jpeg"}).toArray();

               if (!files || files.length === 0) {
                    return res.status(404).json({ message: 'Файловое хранилище изображений пусто' });
               }

               // Построить массив url'ов изображений с метадатой
               const imageUrlsAndExtra = files.map((file) => ({
                    url: `/image/${file._id}`,
                    metadata: file.metadata
               }));

               console.log("Передан весь массив url'ов изображений")
               return res.status(200).json(imageUrlsAndExtra);
          }
          catch (e) {
               console.log("Ошибка отображения изображений: " + e)
          }
     }
}

var controller = new DebugController()
export { controller }