import jwt from "jsonwebtoken"
import security_constants from "../common/SecurityConstants"

import { Request, Response, NextFunction } from "express"
import { API_Response, API_ErrorResponse, StatusCodes, KnownErrors } from "../common/types/API_Responses"
import { ReturnAPIResponse } from "../common/helpers/Responses"
import { DecodeAccessLevel } from "../common/helpers/DecodeAccessLevel"
import AccessLevel from "../common/AccessLevel"

/**
 * Проверить права доступа клиента
 * @param {Number} accessLevelRequired Необходимый уровень доступа, который должен быть у пользователя
 */
export function AccessCheckMiddleware (accessLevelRequired : Number) {
     return function (req : any, res : Response, next : NextFunction) 
     {
          try {
               const authHeader = req.headers.authorization
               if (!authHeader) {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams,
                         "Отсутствует заголовок авторизации"
                    ))
               }
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

               if (decodedPayload.accessLevel != accessLevelRequired)
               {
                    console.log("Несоответствующий уровень доступа: " + decodedPayload.accessLevel + " != " + accessLevelRequired)
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.Forbidden,
                         KnownErrors.InsufficientAccess,
                         "Несоответствующий уровень доступа"
                    ))
               }
               req["accessLevel"] = decodedPayload.accessLevel
               req["requestorUserId"] = decodedPayload.id
               next()
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
                    "Внутренняя ошибка сервера при проверке уровня доступа. Обратитесь к кому-нибудь"
               ))
          }
     }
}

/**
 * Потребовать, чтобы права доступа клиента были среди подходящих перечисленных
 * @param {Number} accessRequiredArray Перечеисление уровней доступа, разрешающих операцию
 */
export function RequireAccessCheckMiddleware (accessRequiredArray : Array<number>) {
     return function (req : any, res : Response, next : NextFunction) 
     {
          try {
               const authHeader = req.headers.authorization
               if (!authHeader) {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.InsufficientAccess,
                         "Отсутствует заголовок авторизации (AuthHeader)."
                    ))
               }
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

               if (!accessRequiredArray.includes(decodedPayload.accessLevel))
               {
                    let errorMessage = DecodeAccessLevel(decodedPayload.accessLevel) + " не может выполнять это действие"

                    switch (decodedPayload.accessLevel) {
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

               /// Уровень доступа корректен. Обновить тело запроса для последующих middleware
               req["accessLevel"] = decodedPayload.accessLevel
               req["requestorUserId"] = decodedPayload.id

               next()
          }
          catch (e) {
               console.log("Ошибка проверки уровня доступа: " + e)
               if (e instanceof jwt.JsonWebTokenError) {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.InternalError,
                         KnownErrors.InternalError,
                         "Ошибка проверки токена, JsonWebTokenError"
                    ))
               }
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Внутренняя ошибка сервера при проверке уровня доступа"
               ))
          }
     }
}