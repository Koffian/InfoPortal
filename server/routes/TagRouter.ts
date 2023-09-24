import { Router } from "express"
import { controller as TagController } from "../controllers/TagController"
import { HandleAuthorisationMiddleware, RequireAccessLevelMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с тегами сообщества */
const router = Router()

/** Получить список всех тегов */
router.get("/", HandleAuthorisationMiddleware, TagController.FindTags)

router.get("/:id", HandleAuthorisationMiddleware, TagController.GetTagByID)

/*Создать новый тэг (от имени модератора или администратора)  */
router.post("/", RequireAccessLevelMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.CreateNewTag)

/*Обновить информацию о теге (от имени модератора или администратора)  */
router.put("/:id", RequireAccessLevelMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.UpdateTag)

/** Привязать существующий тег к элементу */
router.post("/push/:id", RequireAccessLevelMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.PushTag)

/** Отвязать существующий тег от элемента */
router.post("/pop/:id", RequireAccessLevelMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.PopTag)

export {router as tagRouter}
