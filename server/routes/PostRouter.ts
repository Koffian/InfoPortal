import { Router } from "express"
import { controller as PostController } from "../controllers/PostController"
import {AccessCheckMiddleware, RequireAccessCheckMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с постами сообщества */
const router = Router()

/** Получить список всех постов */
router.get("/", PostController.GetPosts)

/*Получить один пост */
router.get("/:id", PostController.GetPostByURL)

/*Модифицировать пост согласно ID */
router.put("/:id", RequireAccessCheckMiddleware([AccessLevel.User, AccessLevel.Moderator, AccessLevel.Administrator]), PostController.UpdatePost)

/*Создать новый пост (от учётки User)  */
router.post("/upload", RequireAccessCheckMiddleware([AccessLevel.User]), PostController.CreatePost)

/* Поиск совпадений*/
router.get("/matches", PostController.GetPostMatches)

router.delete("/:id", AccessCheckMiddleware(AccessLevel.Administrator), PostController.DeletePost)

export {router as postsRouter}
