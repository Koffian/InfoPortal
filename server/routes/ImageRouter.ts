import { Router } from "express"
import { controller as ImageController } from "../controllers/ImageController"
import ContentTypes from "../common/ContentTypes"
import UploadMiddleware from "../middleware/UploadMiddleware"
import { upload } from "../MongoConnection"

/** Скорее всего лишний роутер*/
const router = Router()

router.get("/:id", ImageController.GetImage)

export {router as imageRouter}

