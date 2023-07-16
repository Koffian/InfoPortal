import jwt from "jsonwebtoken"
import security_constants from "../common/SecurityConstants"

// import { AccessLevel } from "../common/AccessLevel"
// import { json } from "body-parser"

/**
 * Проверить права доступа клиента
 * @param {*} req Тело запроса
 * @param {*} res Тело ответа
 * @param {*} next Вызов следующего коллбека при подходящем доступе
 */
function AccessCheckMiddleware (accessLevelRequired : Number) {
     return function (req : any, res : any, next : any) 
     {
          try {
               const authHeader = req.headers.authorization
               if (!authHeader) {
                    return res.status(403).json({error: {message: "Отсутствует заголовок авторизации"}})
               }
               const authToken = authHeader.split(' ')[1]
               if (!authToken) {
                    return res.status(403).json({error: {message: "Отсутствует токен авторизации"}})
               }

               ///@todo Заменить any на настоящий тип: jwt.JwtPayload | string
               const decodedPayload: any = jwt.verify(authToken, security_constants.tokenSecret)

               if (decodedPayload.accessLevel != accessLevelRequired)
               {
                    console.log("Несоответствующий уровень доступа: " + decodedPayload.accessLevel + " != " + accessLevelRequired)
                    return res.status(401).json({error: {message: "Несоответствующий уровень доступа"}})
               }
               next()
          }
          catch (e) {
               console.log("Ошибка проверки уровня доступа: " + e)
               if (e instanceof jwt.JsonWebTokenError) {
                    return res.status(400).json({error: {message: "Невалидный токен " + e}})
               }
               return res.status(400).json({error: {message: "Ошибка проверки уровня доступа"}})
          }
     }
}

export default AccessCheckMiddleware