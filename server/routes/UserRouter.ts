import { Router } from "express"
import { controller } from "../controllers/UserController"
import AccessCheckMiddleware  from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

const router = Router()

router.get("/find", controller.FindUsers)

export {router as userRouter}