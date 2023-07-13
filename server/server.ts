const express = require("express")
const mongoose = require("mongoose")
const defaultRouter = require('./routes/DefaultRouter.ts')
const authRouter = require("./routes/AuthRouter.ts")
const adminRouter = require("./routes/AdminRouter.ts")
const Logger = require("./common/Logger.ts")

const port = 5000        ///< Порт
const host = "127.0.0.1" ///< Адрес (localhost)

const mongoURI = "mongodb://0.0.0.0:27017/portal" ///< Адрес сервера БД

const app = express()
app.use(express.json())
app.use((req : any, res : any, next : any) => {
     res.set('Access-Control-Allow-Origin', ['*']);
     res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
     res.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
     next();
});


app.use("/", defaultRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)

const Start = async() => {
     try {
          await mongoose.connect(mongoURI)
          app.listen(port, host, () => {Logger.info("Сервер слушает на " + host + ":" + port)})
     }
     catch (e) {
          Logger.error("Ошибка запуска сервера: " + e)
     }
     
}

Start()