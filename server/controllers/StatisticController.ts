import { Response } from "express";

import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import Tag from "../models/Tag";
import { API_Response, StatusCodes } from "../common/types/API_Responses";
import { ReturnAPIResponse } from "../common/helpers/Responses";

/** Контроллер статистики */
class StatisticController {
/** Запрос сводной информации о состоянии сепрвера */
  async GetAllStatistic(req: any, res: Response) {
     const commentNumber = (await Comment.find()).length;
     const postNumber = (await Post.find()).length;
     const tagNumber = (await Tag.find()).length;
     const userNumber = (await User.find()).length;
     let portalStatistics = {
       commentFound: commentNumber,
       postsFound: postNumber,
       tagsFound: tagNumber,
       usersFound: userNumber,
     };
     
     return ReturnAPIResponse(res, new API_Response(
          StatusCodes.Success,
          portalStatistics,
          "Успешно отдана информация о состоянии сервера"
     )); 
  }
}

var controller = new StatisticController();
export { controller };
