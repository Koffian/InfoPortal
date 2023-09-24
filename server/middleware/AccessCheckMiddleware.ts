import jwt from "jsonwebtoken"
import security_constants from "../common/SecurityConstants"

import { Request, Response, NextFunction } from "express"
import { API_Response, API_ErrorResponse, StatusCodes, KnownErrors } from "../common/types/API_Responses"
import { ReturnAPIResponse } from "../common/helpers/Responses"
import { DecodeAccessLevel } from "../common/helpers/DecodeAccessLevel"
import AccessLevel from "../common/AccessLevel"


function HandleAuthorization(req: any, res : Response)
{
     try {
          const authHeader = req.headers.authorization

          /// 1. Неавторизированный доступ. Доступ к ресурсам возможен, однако у гостевого пользователя будет урезанный функционал
          if (!authHeader)
          {
               req["isAuthorized"] = false
          }
          /// 2. Авторизированный доступ. В таком случае необходимо проверить заголовок авторизации и декодировать токен.
          else
          {
               const authToken = authHeader.split(' ')[1]
               if (!authToken) {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Отсутствует токен авторизации (примерно нужно: bearer ' ' 123213..., через пробел)"
                    ))
               }
               ///@todo Заменить any на настоящий тип: jwt.JwtPayload | string
               const decodedPayload: any = jwt.verify(authToken, security_constants.tokenSecret)

               req["accessLevel"] = decodedPayload.accessLevel
               req["requestorUserId"] = decodedPayload.id
               req["isAuthorized"] = true
          }
          return req["isAuthorized"]
     }
     catch (e) {
          console.log("Ошибка проверки уровня доступа: " + e)
          if (e instanceof jwt.JsonWebTokenError) {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.BadRequest,
                    KnownErrors.BadParams,
                    "Не прошла проверка JsonWebToken (невалидный токен)"
               ))
          }
          return ReturnAPIResponse(res, new API_ErrorResponse(
               StatusCodes.InternalError,
               KnownErrors.InternalError,
               "Внутренняя ошибка сервера при установки флагов авторизации. Обратитесь к кому-нибудь"
          ))
     }
}

/**
 * Установить флаги авторизации пользователя без дополнительных проверок.
 */
export function HandleAuthorisationMiddleware (req : any, res : Response, next : NextFunction)
{
     try {
          const checkResult: any = HandleAuthorization(req, res)
          if (checkResult instanceof API_ErrorResponse)
          {
               return checkResult
          }
          next()
     }
     catch (e) {
          return ReturnAPIResponse(res, new API_ErrorResponse(
               StatusCodes.InternalError,
               KnownErrors.InternalError,
          "Внутренняя ошибка сервера при проверке авторизации. Обратитесь к кому-нибудь"
          ))
     }
}

/**
 * Потребовать авторизацию пользователя, т.е. работу с существующей учётной записью
*/
export function RequireAuthorizationMiddleware () {
     return function (req : any, res : Response, next : NextFunction) 
     {
          try {
               const checkResult: any = HandleAuthorization(req, res)
               if (checkResult instanceof API_ErrorResponse)
               {
                    return checkResult
               }
               if (req["isAuthorized"] === false)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Для этого метода необходим авторизованный доступ. Пожалуйста, используйте учётную запись"
                    ))
               }
               next()
          }
          catch (e) {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Внутренняя ошибка сервера при требовании авторизации"
               ))
          }
     }
}

/**
 * Потребовать, чтобы права доступа клиента были среди подходящих перечисленных
 * @param {Number} accessRequiredArray Перечеисление уровней доступа, разрешающих операцию
 */
export function RequireAccessLevelMiddleware (accessRequiredArray : Array<number>) {
     return function (req : any, res : Response, next : NextFunction) 
     {
          try {
               const checkResult: any = HandleAuthorization(req, res)
               if (checkResult instanceof API_ErrorResponse)
               {
                    return checkResult
               }

               if (!accessRequiredArray.includes(req["accessLevel"]))
               {
                    let errorMessage = DecodeAccessLevel(req["accessLevel"]) + " не может выполнять это действие"

                    switch (req["accessLevel"]) {
                         case AccessLevel.Administrator:
                              errorMessage += ". Попробуйте выполнить действие от имени обычного пользователя или модератора. Наполнение контентом лучше выполнять от других учёток (комментирование и пр. по мелочи)"
                              break;
                         case AccessLevel.Moderator:
                              errorMessage += ". Не хватает модераторских прав. Обратитесь к администратору."
                              break;
                         case AccessLevel.User:
                              errorMessage += ". Обратитесь к модератору или администратору "
                              break;
                    }

                    console.log(errorMessage)
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.Forbidden,
                         KnownErrors.InsufficientAccess,
                         errorMessage
                    ))
               }

               next()
          }
          catch (e) {
               console.log("Ошибка проверки уровня доступа: " + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Внутренняя ошибка сервера при проверке уровня доступа"
               ))
          }
     }
}