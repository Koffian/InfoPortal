import express, { NextFunction, Request, Response } from "express";

import { authRouter } from "./routes/AuthRouter";
import { userRouter } from "./routes/UserRouter";
import { uploadRouter } from "./routes/UploadRouter";
import { postsRouter } from "./routes/PostRouter";
import { imageRouter } from "./routes/ImageRouter";
import { tagRouter } from "./routes/TagRouter";
import { karmaRouter } from "./routes/KarmaRouter";
import { statisticRouter } from "./routes/StatisticRouter";
import Post from "./models/Post";
import Comment from "./models/Comment";
import User from "./models/User";
import Tag from "./models/Tag";

import Logger from "./common/Logger";
import { Network } from "./common/Network";
import {
  ReadServerState,
  WriteServerState,
  ServerState,
} from "./common/Config";

import cors from "cors";
import { commentRouter } from "./routes/CommentRouter";

const app = express();

/** Использовать CORS для возможности cross-origin запросов (не только в одном домене) */
app.use(cors());

// Middleware для приложения express
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Allow-Origin", ["*"]);
  res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.set("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
  next();
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postsRouter);
app.use("/tags", tagRouter);
app.use("/statistics", statisticRouter);
app.use("/upload", uploadRouter);
app.use("/image", imageRouter);
app.use("/comments", commentRouter);
app.use("/karma", karmaRouter);

/** Для дебага. Вернуть строку по корню / */
app.get("/", async (req, res) => {
  const postfound = await Post.find();
  const postnumber = postfound.length;
  const usersfound = await User.find();
  const usernumber = usersfound.length;
  const tagsfound = await Tag.find();
  const tagsnumber = tagsfound.length;
  const commentnumber = (await Comment.find()).length;
  console.log("Кол-во постов:" + postnumber);
  let portalStatistics = {
    postsFound: postnumber,
    usersFound: usernumber,
    tagsFound: tagsnumber,
    commentFound: commentnumber,
  };
  res.status(200).json(portalStatistics);
});

const Start = async () => {
  try {
    const serverState = await ReadServerState();

    if (serverState === ServerState.notInitialized) {
      console.log(
        "Не проинициализирован сервер / бд сервера, завершение работы... "
      );
      console.log("Для инициализации используйте: 'npm run init'");
      process.exit(0);
    }

    app.listen(Network.hostPort, Network.hostAddress, () => {
      console.log("Сервер слушает на " + Network.hostName);
    });
  } catch (e) {
    Logger.error("Ошибка запуска сервера: " + e);
  }
};
Start();
