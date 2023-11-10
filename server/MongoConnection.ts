import mongoose from "mongoose"
import mongodb, { GridFSBucket } from "mongodb"
import { GridFsStorage} from "multer-gridfs-storage"
import path from "path"
import crypto from "crypto"

import g, { Grid } from "gridfs-stream"
import multer from "multer"
import { Network } from "./common/Network"

const connection = mongoose.createConnection(Network.mongoURL)

/** Название "ведра" в базе данных, где совместно лежат файлы и их чанки */
const bucketName = "uploads"

/**
 * Поток GridFS для работы с файлами больше 16МБ
 */
let gfs : g.Grid
let gridfsBucket : mongoose.mongo.GridFSBucket

connection.once('open', () => {
     gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
          bucketName: bucketName
     })
     gfs = g(connection.db, mongoose.mongo)
     gfs.collection(bucketName)
     
     console.log ("Connected to mongodb: " + Network.mongoURL)
})

/**
     Хранилище загружаемых файлов GridFS из MongoDB.
     Файлы хранятся в виде чанков в Mongo
*/ 
const storage = new GridFsStorage({
     url: Network.mongoURL,
     file: (req, file) => {
       return new Promise((resolve, reject) => {
         crypto.randomBytes(16, (err : any, buf : any) => {
           if (err) {
             return reject(err);
           }
           const filename = buf.toString('hex') + path.extname(file.originalname);
          
           const fileInfo = {
             filename: filename,
             bucketName: 'uploads',
             /** Дополнительные поля */
             metadata: {
               originalName: file.originalname,
               description: "Изображение png/jpeg/jpg"
               }
           };
           resolve(fileInfo);
          });
          });
     }
});

/**
 * Middleware для добавления файла в хранилище.
 * Сразу сохраняет файл в файловой системе GridFS, а не в памяти.
 */
const upload = multer({storage: storage})

export {connection, upload, gfs, gridfsBucket }
