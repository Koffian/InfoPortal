import { Router } from "express";
import { controller as StatisticController } from "../controllers/StatisticController";

const router = Router();

/** Роутер получения статистики - сводной информации о состоянии сервера */

router.get("/", StatisticController.GetAllStatistic);

export { router as statisticRouter };
