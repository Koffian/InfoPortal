import { Router } from "express"
import { controller as CommentController } from "../controllers/CommentController"
import { HandleAuthorisationMiddleware, RequireAccessLevelMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с комментариями участников сообщества */
const router = Router()

/** Получить информацию о комментарии */
router.get("/:id", HandleAuthorisationMiddleware, CommentController.GetComment)

/*Оставить комментарий к посту/другому комментарию */
router.post("/:id", RequireAccessLevelMiddleware([AccessLevel.User, AccessLevel.Moderator]), CommentController.CreateComment)

router.get("/aggregate/:id", HandleAuthorisationMiddleware, CommentController.AggregateComments)

export {router as commentRouter}
