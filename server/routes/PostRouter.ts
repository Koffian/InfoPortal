import { Router } from "express"
import { controller as PostController } from "../controllers/PostController"
import {HandleAuthorisationMiddleware, RequireAccessLevelMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с постами сообщества */
const router = Router()

/** Получить список всех постов */
router.get("/", HandleAuthorisationMiddleware, PostController.GetPosts)

/*Получить один пост */
router.get("/:id", HandleAuthorisationMiddleware, PostController.GetPostByURL)

/*Модифицировать пост согласно ID */
router.put("/:id", RequireAccessLevelMiddleware([AccessLevel.User, AccessLevel.Moderator, AccessLevel.Administrator]), PostController.UpdatePost)

/*Создать новый пост (от учётки User)  */
router.post("/upload", RequireAccessLevelMiddleware([AccessLevel.User]), PostController.CreatePost)

router.delete("/:id", RequireAccessLevelMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), PostController.DeletePost)

export {router as postsRouter}
