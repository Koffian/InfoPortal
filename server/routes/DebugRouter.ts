import { Router } from "express"
import { controller } from "../controllers/DebugController"

const router = Router()

router.get("/images", controller.GetAllImageURLS)

export {router as debugRouter}