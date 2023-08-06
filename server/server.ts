import express, { NextFunction, Request, Response } from "express"

import { authRouter }  from "./routes/AuthRouter"
import { userRouter } from  "./routes/UserRouter"
import { uploadRouter } from "./routes/UploadRouter"
import Logger from "./common/Logger"
import { postsRouter } from "./routes/PostRouter"
import { imageRouter } from "./routes/ImageRouter"
import { Network } from "./common/Network"
import cors from "cors"
import { ReadServerState, WriteServerState, ServerState } from "./common/Config"

const app = express()

/** Использовать CORS для возможности cross-origin запросов (не только в одном домене) */
app.use(cors());

// Middleware для приложения express
app.use(express.json())
app.use((req : Request, res : Response, next : NextFunction) => {
     res.set('Access-Control-Allow-Origin', ['*']);
     res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
     res.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
     next();
});

app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/posts", postsRouter)

app.use("/upload", uploadRouter)
app.use("/image", imageRouter)

/** Для дебага. Вернуть строку по корню / */
app.get('/', (req, res) => {
     res.send('backend-API информационного портала');
   });

const Start = async() => {
     try {
          const serverState = await ReadServerState()

          if (serverState === ServerState.notInitialized) 
          {
               console.log("Не проинициализирован сервер / бд сервера, завершение работы... ")
               console.log("Для инициализации используйте: 'npm run init'")
               process.exit(0);
          }
          
          app.listen(Network.hostPort, Network.hostAddress, () => {console.log("Сервер слушает на " + Network.hostName)})
     }
     catch (e) {
          Logger.error("Ошибка запуска сервера: " + e)
     }
     
}
     Start()

