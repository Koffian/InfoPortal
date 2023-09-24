import { Router } from "express"
import { controller as karmaController } from "../controllers/KarmaController"
import { RequireAccessLevelMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с постами сообщества */
const router = Router()

/** Сделать оценку на пост/комментарий */
router.put("/rate/:id", RequireAccessLevelMiddleware([AccessLevel.User]), karmaController.ReactToContent)

export {router as karmaRouter}
