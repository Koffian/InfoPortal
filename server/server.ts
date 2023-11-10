import express, { NextFunction, Request, Response } from "express";

import { authRouter } from "./routes/AuthRouter";
import { userRouter } from "./routes/UserRouter";
import { postsRouter } from "./routes/PostRouter";
import { tagRouter } from "./routes/TagRouter";
import { karmaRouter } from "./routes/KarmaRouter";
import { statisticRouter } from "./routes/StatisticRouter";
import { storageRouter } from "./routes/StorageRouter";

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
app.use("/storage", storageRouter);
app.use("/comments", commentRouter);
app.use("/karma", karmaRouter);

/** Для дебага. Вернуть строку по корню / */
app.get("/", async (req, res) => {
  res.send("Backend-Api информационного портала, размещённого по адресу " + Network.hostName);
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
