import { Router } from "express"
import { controller } from "../controllers/UserController"
import registrationMiddleware from "../middleware/RegistrationMiddleware"

const router = Router()

router.post("/registration", registrationMiddleware, controller.RegisterUser)
router.post("/login", controller.LogIn)

export {router as authRouter}