import { Router } from "express"
import { controller as PostController } from "../controllers/PostController"
import AccessCheckMiddleware from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с постами сообщества */
const router = Router()

/** Получить список всех постов */
router.get("/", PostController.GetPosts)

/*Получить один пост */
router.get("/:id", PostController.GetPostByURL)

/* Поиск совпадений*/
router.get("/matches", PostController.GetPostMatches)

router.delete("/:id", AccessCheckMiddleware(AccessLevel.Administrator), PostController.DeletePost)

export {router as postsRouter}
