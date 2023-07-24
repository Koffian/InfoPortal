import { Router } from "express"
import { controller as imageController } from "../controllers/ImageController"
import { controller as postController } from "../controllers/PostController"
import ContentTypes from "../common/ContentTypes"
import UploadMiddleware from "../middleware/UploadMiddleware"
import { upload } from "../MongoConnection"
import GridFsMiddleware from "../middleware/GridFsMiddleware"

/** Роутер загрузки контента на сайт /upload/.. */
const router = Router()

router.post("/image", upload.single('file'), GridFsMiddleware)

/**
 * TODO
 * 1. Проверка прав доступа
 * 2 ....
 */
/** Загрузить пост сообщества (временно здесь, желательно перенести в UserRouter, когда будет) */
router.post("/post", UploadMiddleware(ContentTypes.POST), postController.CreateNewPost)

export {router as uploadRouter}