import { Request, Response } from "express";
import {
  API_ErrorResponse,
  API_Response,
  KnownErrors,
  StatusCodes,
} from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";
import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import {
  ReactToElement,
  GetRatingMethodCode,
} from "../common/helpers/KarmaHelpers";
import { Console } from "winston/lib/winston/transports";

/** Контроллер статистики */
class StatisticController {
  async GetStatistic(req: any, res: Response) {
    const postfound = await Post.find();
    const postnumber = postfound.length;
    console.log("Кол-во постов:" + postnumber);
    Post.count;
  }
}
var controller = new StatisticController();
export { controller };
