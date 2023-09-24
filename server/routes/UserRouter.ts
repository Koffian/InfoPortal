import { Router } from "express"
import { controller } from "../controllers/UserController"
import { HandleAuthorisationMiddleware, RequireAccessLevelMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

const router = Router()

router.get("/find", HandleAuthorisationMiddleware, controller.FindUsers)
router.get("/:id", HandleAuthorisationMiddleware, controller.FindUserByID)
router.get("/", HandleAuthorisationMiddleware, controller.GetUserByQuery)

router.put("/:id", RequireAccessLevelMiddleware([AccessLevel.User, AccessLevel.Moderator, AccessLevel.Administrator]), controller.UpdateUserById)
router.delete("/:id", RequireAccessLevelMiddleware([AccessLevel.Administrator]), controller.DeleteUserById)

export {router as userRouter}