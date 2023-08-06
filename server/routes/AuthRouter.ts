import { Router } from "express"
import { controller } from "../controllers/AccountController"
import registrationMiddleware from "../middleware/RegistrationMiddleware"

const router = Router()

router.post("/registration", registrationMiddleware, controller.RegisterUser)
router.get("/login", controller.LogIn)

export {router as authRouter}