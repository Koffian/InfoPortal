import { Router } from "express"
import { controller } from "../controllers/DefaultController"

const router = Router()

router.get("/", controller.SayHello)

export {router as defaultRouter}