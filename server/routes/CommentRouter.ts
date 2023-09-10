import { Router } from "express"
import { controller as CommentController } from "../controllers/CommentController"
import {AccessCheckMiddleware, RequireAccessCheckMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с комментариями участников сообщества */
const router = Router()

/** Получить информацию о комментарии */
router.get("/:id", CommentController.GetComment)

/*Оставить комментарий к посту/другому комментарию */
router.post("/:id", RequireAccessCheckMiddleware([AccessLevel.User, AccessLevel.Moderator]), CommentController.CreateComment)

router.get("/aggregate/:id", CommentController.AggregateComments)

// /*Модифицировать пост согласно ID */
// router.put("/:id", RequireAccessCheckMiddleware([AccessLevel.User, AccessLevel.Moderator, AccessLevel.Administrator]), PostController.UpdatePost)

// /*Создать новый пост (от учётки User)  */
// router.post("/upload", RequireAccessCheckMiddleware([AccessLevel.User]), PostController.CreatePost)

// /* Поиск совпадений*/
// router.get("/matches", PostController.GetPostMatches)

// router.delete("/:id", AccessCheckMiddleware(AccessLevel.Administrator), PostController.DeletePost)

export {router as commentRouter}
