import { Router } from "express"
import { controller as TagController } from "../controllers/TagController"
import {AccessCheckMiddleware, RequireAccessCheckMiddleware } from "../middleware/AccessCheckMiddleware"
import AccessLevel from "../common/AccessLevel"

/** Роутер для работы с тегами сообщества */
const router = Router()

/** Получить список всех тегов */
router.get("/", TagController.FindTags)

router.get("/:id", TagController.GetTagByID)

/*Создать новый тэг (от имени модератора или администратора)  */
router.post("/", RequireAccessCheckMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.CreateNewTag)

/*Обновить информацию о теге (от имени модератора или администратора)  */
router.put("/:id", RequireAccessCheckMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.UpdateTag)

/** Привязать существующий тег к элементу */
router.post("/push/:id", RequireAccessCheckMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.PushTag)

/** Отвязать существующий тег от элемента */
router.post("/pop/:id", RequireAccessCheckMiddleware([AccessLevel.Moderator, AccessLevel.Administrator]), TagController.PopTag)

export {router as tagRouter}
