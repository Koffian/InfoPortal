import { Router } from "express"
import { controller as StorageController } from "../controllers/StorageController"
import { upload } from "../MongoConnection"

/** Роутер работы с файловым хранилищем сервера */
const router = Router()

router.get("/:id", StorageController.GetImage)

router.post("/upload", upload.single('file'))


export {router as storageRouter}