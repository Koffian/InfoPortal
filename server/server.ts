import express, { NextFunction, Request, Response } from "express"

import { debugRouter } from './routes/DebugRouter'
import { authRouter }  from "./routes/AuthRouter"
import { adminRouter } from  "./routes/AdminRouter"
import { uploadRouter } from "./routes/UploadRouter"
import Logger from "./common/Logger"
import { contentRouter } from "./routes/ContentRouter"
import { imageRouter } from "./routes/ImageRouter"
import { Network } from "./common/Network"
import cors from "cors"

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

app.use("/debug", debugRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)
app.use("/upload", uploadRouter)
app.use("/content", contentRouter)
app.use("/image", imageRouter)

/** Для дебага */
app.get('/', (req, res) => {
     res.send('backend-API информационного портала');
   });

const Start = async() => {
     try {
          app.listen(Network.hostPort, Network.hostAddress, () => {console.log("Сервер слушает на " + Network.hostName)})
     }
     catch (e) {
          Logger.error("Ошибка запуска сервера: " + e)
     }
     
}

Start()