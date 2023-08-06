import { Router } from "express"
import { controller as imageController } from "../controllers/ImageController"
import { controller as postController } from "../controllers/PostController"
import UploadMiddleware from "../middleware/UploadMiddleware"
import { upload } from "../MongoConnection"
import GridFsMiddleware from "../middleware/GridFsMiddleware"

/** Роутер загрузки контента на сайт /upload/.. */
const router = Router()

router.post("/image", upload.single('file'), GridFsMiddleware)

/** Загрузить пост сообщества (временно здесь, желательно перенести в UserRouter, когда будет) */
router.post("/post", UploadMiddleware(3), postController.CreateNewPost)

export {router as uploadRouter}