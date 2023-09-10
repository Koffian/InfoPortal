import { Router } from "express"
import { controller } from "../controllers/UserController"
import { AccessCheckMiddleware, RequireAccessCheckMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

const router = Router()

router.get("/find", controller.FindUsers)
router.get("/:id", controller.FindUserByID)
router.get("/", controller.GetUserByQuery)

router.put("/:id", RequireAccessCheckMiddleware([AccessLevel.User, AccessLevel.Moderator, AccessLevel.Administrator]), controller.UpdateUserById)
router.delete("/:id", RequireAccessCheckMiddleware([AccessLevel.Administrator]), controller.DeleteUserById)

export {router as userRouter}