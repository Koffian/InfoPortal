export {};

const jwt = require('jsonwebtoken')
const AccessLevel = require("../common/AccessLevel.ts")
const security_constants = require("../common/SecurityConstants.ts")

/**
 * Проверить права доступа клиента
 * @param {*} req Тело запроса
 * @param {*} res Тело ответа
 * @param {*} next Вызов следующего коллбека при подходящем доступе
 */
function VerifyRegistrationRequest (accessLevelRequired : typeof AccessLevel) {
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

               const decodedPayload = jwt.verify(authToken, security_constants.tokenSecret)

               if (decodedPayload.accessLevel != accessLevelRequired)
               {
                    console.log("Несоответствующий уровень доступа")
                    return res.status(401).json({error: {message: "Несоответствующий уровень доступа"}})
               }
               next()
          }
          catch (e) {
               console.log("Ошибка проверки уровня доступа:" + e)
               if (e instanceof jwt.JsonWebTokenError) {
                    return res.status(400).json({error: {message: "Невалидный токен"}})
               }
               return res.status(400).json({error: {message: "Ошибка проверки уровня доступа"}})
          }
     }
}

module.exports = VerifyRegistrationRequest