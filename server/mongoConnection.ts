import mongoose from "mongoose"
import { GridFsStorage } from "multer-gridfs-storage"
import g, { Grid } from "gridfs-stream"
import multer from "multer"

const mongoURI = "mongodb://0.0.0.0:27017/portal" ///< Адрес сервера БД

const connection = mongoose.createConnection(mongoURI)

/**
 * Поток GridFS для работы с файлами больше 16МБ
 */
let gfs

connection.once('open', () => {
     console.log ("Connected to mongodb")
     gfs = g(connection.db, mongoose.mongo)
     gfs.collection('uploads')
})

export {connection, gfs }