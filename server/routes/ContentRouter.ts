import { Router } from "express"
import { controller as ImageController } from "../controllers/ImageController"
import { controller as PostController } from "../controllers/PostController"
import ContentTypes from "../common/ContentTypes"
import UploadMiddleware from "../middleware/UploadMiddleware"
import { upload } from "../MongoConnection"

/** Роутер для получения контента с сайта (посты, изображения, гифки, .etc) */
const router = Router()

router.get("/image/:id", ImageController.GetImage)

/** Получить список всех постов */
router.get("/posts", PostController.GetAllPostsURLS)

/*Получить один пост */
router.get("/post/:id", PostController.GetPostByURL)

export {router as contentRouter}

