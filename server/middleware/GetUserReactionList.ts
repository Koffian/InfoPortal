import { Request, Response, NextFunction } from "express"
import { controller as userController } from "../controllers/UserController"

/**Получить список реакций данного пользователя и добавить список в тело респонса */
function GetUserReactionsMiddleware(req: Request, res: Response, next: NextFunction)
{

}