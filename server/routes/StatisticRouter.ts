import { Router } from "express";
import { controller as ImageController } from "../controllers/ImageController";

const router = Router();

router.get("/", ImageController.GetImage);

export { router as statisticRouter };
