import { Router } from "express"
import { controller } from "../controllers/AccountController"
import AccessCheckMiddleware  from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

const router = Router()

router.get("/accounts", AccessCheckMiddleware(AccessLevel.Administrator), controller.GetAccounts)

export {router as adminRouter}