import { Router } from "express"
import { controller } from "../controllers/UserController"
import registrationMiddleware from "../middleware/RegistrationMiddleware"

const authRouter = Router()

authRouter.post("/registration", registrationMiddleware, controller.RegisterUser)
authRouter.post("/login", controller.LogIn)

export {authRouter as authRouter}