import { Router } from "express"
import { controller as PostController } from "../controllers/PostController"

/** Роутер для работы с постами сообщества */
const router = Router()

/** Получить список всех постов */
router.get("/", PostController.GetAllPostsURLS)

/*Получить один пост */
router.get("/:id", PostController.GetPostByURL)

export {router as postsRouter}
