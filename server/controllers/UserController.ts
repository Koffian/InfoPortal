import User from "../models/User"
import AccessLevel from "../common/AccessLevel"
import security_constants from "../common/SecurityConstants"
import Logger from "../common/Logger"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { API_ErrorResponse, API_Response, KnownErrors, StatusCodes } from "../common/types/API_Responses"
import { ReturnAPIResponse } from "../common/helpers/Responses"
import { Request, Response } from "express"

/**
 * Генерация токена доступа пользователя
 * @param {Schema.Types.ObjectId} id ID пользователя
 * @param {Number} accessLevel Уровень доступа пользователя
 * @returns Подписанный токен
 */
const generateAccessToken = (id : any, accessLevel : any) => {
     const payload = {
         id,
         accessLevel,
     }
     return jwt.sign(payload, 
                     security_constants.tokenSecret,
                     {expiresIn: security_constants.tokenExpirationTime})
 }

/**
 * Контроллер для работы с сущностями пользовательских учёток в БД
 */
class UserController
{
     /**
      * Регистрация новой учётной записи с правами обычного пользователя (User)
      * @param {*} req Тело запроса
      * @param {*} res Тело ответа
      * @returns Респонс с кодом 201 при успешном добавлении, коды 400-403 при ошибках
      */
     async RegisterUser(req : any, res : any) {
          try 
          {
               const {username, password} = req.body
               const candidate = await User.findOne({username})
               if (candidate) {

                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.AlreadyExists,
                         KnownErrors.AlreadyExists,
                         "Такой пользователь уже существует"
                    ))
               }
               const hashedPassword = bcrypt.hashSync(password, 7)
               const user = new User({username, password: hashedPassword, access: AccessLevel.User})
               await user.save()

               console.log("Зарегистрирован аккаунт " + username)

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success, 
                    undefined,
                    "Зарегистрирован аккаунт " + username
               ));

          } 
          catch (e) {
               console.log("Ошибка регистрации пользователя: " + e)

               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Не удалось зарегистрировать пользователя с логином" + req.body.username
               ));
          }
      }
  
     /**
      * Войти в учётную запись с помощью логина/пароля и получить токен доступа
      * @param {*} req Тело запроса
      * @param {*} res Тело ответа
      * @returns Респонс с токеном и кодом 200 при успешном логине, коды ~400 при ошибках
      */
     async LogIn(req : any, res : any) {
          try {
               const {username, password} = req.body
               const user = await User.findOne({username})
               if (!user) {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден пользователь " + username
                    ))
               }  
               const isValidPassword = bcrypt.compareSync(password, user.password)
               if (!isValidPassword) {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.Forbidden,
                         KnownErrors.Forbidden,
                         "Неправильный пароль."
                    ));
               }
               const token = generateAccessToken(user._id, user.access)

               console.log("Пользователь " + username + " авторизовался и получил токен доступа: " + token)

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    {token, roles: user.access},
                    "Выдан токен для пользователя " + username
               ));

          } 
          catch (e) {
               console.log("Авторизация пользователя завершилась с ошибкой:" + e)
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Авторизация завершилась с ошибкой на сервере: " + e
               ))
          }
     }

     /**
      * Поиск пользоватлей системы по логину
      * @param {*} req Тело запроса
      * @param {*} res Тело ответа
      */
     async FindUsers(req : Request, res : Response) {
          try 
          {
               let usernameQuery = req.query.login || "";

               // if (typeof(usernameQuery) != typeof(String))
               // {
               //      Logger.error("Can't find users with undefined login");

               //      return ReturnAPIResponse(res, new API_ErrorResponse(
               //           StatusCodes.BadRequest,
               //           KnownErrors.BadParams, 
               //           "Логин для поиска не определен"));
               // }

               Logger.info("Производится поиск пользователей по логину")

               let userArray: object = {};

               const usersFound = await User.find({ "username" : { $regex: usernameQuery, $options: 'i' } });

               let userCards: any = usersFound.map(user => {
                    const {_id , username, access } = user;
                    return {_id , username, access };
               });

               // Построить массив url'ов изображений с метадатой
               const postArray = {
                    foundAmount: usersFound.length,
                    users: userCards
               };

               console.log("Отдан список постов")

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    postArray,
                    "Отдан список пользователей"
               ));
          } 
          catch (e) 
          {
               Logger.error("Ошибка при получении списка пользователей :" + e)

               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка при получении списка пользователей :" + e
               ));
          }
     }

     async UpdateUserById(req: any, res: Response){
          let userIDQuery = req.params.id;

          if ( req.accessLevel === AccessLevel.User 
               && userIDQuery !== req.requestorUserId)
          {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.Forbidden,
                    KnownErrors.Forbidden, 
                    "Обычный пользователь не может редактировать чужие данные"));
          }

          if (userIDQuery === undefined)
          {
               Logger.error("Не найден пользователь с ID: " + userIDQuery);
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.BadRequest,
                    KnownErrors.BadParams, 
                    "Не найден пользователь с ID: " + userIDQuery));
          }

          const updatedUser: any = await User.findByIdAndUpdate(req.params.id, req.body)

          if (updatedUser === null)
          {
               Logger.error("Не найден пользователь с ID: " + userIDQuery);
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.BadRequest,
                    KnownErrors.BadParams, 
                    "Не найден пользователь с ID: " + userIDQuery));
          }

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    req.body,
                    "Успещно обновлена информация о пользователе"
               ));
     }

     async DeleteUserById(req: any, res: Response){
          let userIDQuery = req.params.id;

          if (userIDQuery.length !== 24 || userIDQuery === undefined)
          {
               Logger.error("Невалидный идентификатор пользователя (Должна быть HEX строка длины 24): " + userIDQuery);
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.BadRequest,
                    KnownErrors.BadParams, 
                    "Невалидный идентификатор пользователя (Должна быть HEX строка длины 24): " + userIDQuery));
          }

          const deletedUser: any = await User.findByIdAndDelete(userIDQuery, req.body)

          if (deletedUser === null || Object.entries(deletedUser).length === 0)
          {
               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.NotFound,
                    KnownErrors.NotFound,
                    "Не найден удаляемый пользователь :"
               ));
          }

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    deletedUser,
                    "Пользователь успешно удалён администратором: " + userIDQuery
               ));
     }

     async GetUserByQuery(req : Request, res : Response) {
          try 
          {
               let usernameQuery: string = req.query.username?.toString() || "";

               console.log("Производится поиск пользователя по юзернейму: " + usernameQuery)

               let userFound: any = await User.findOne({username : usernameQuery });

               
               if (userFound === null)
               {
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.NotFound,
                         KnownErrors.NotFound,
                         "Не найден пользователь с юзернеймом: " + usernameQuery
                         ));
               }
               userFound["password"] = "Хэшированный пароль не отдаётся при просмотре записи пользователя"
               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    userFound,
                    "Передана информация о пользователе"
               ));
          } 
          catch (e) 
          {
               Logger.error("Ошибка при получении пользователя :" + e)

               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка при получении пользователя :" + e
               ));
          }
     }

     async FindUserByID(req : Request, res : Response) {
          try 
          {
               const userIdParam = req.params.id;

               if (userIdParam === undefined || userIdParam.length != 24)
               {
                    Logger.error("Не передан ID пользователя через param параметр");
                    return ReturnAPIResponse(res, new API_ErrorResponse(
                         StatusCodes.BadRequest,
                         KnownErrors.BadParams, 
                         "Не передан ID пользователя через param параметр или ID невалиден по длине"
                    ))
               }

               Logger.info("Производится поиск пользователя по ID: " + userIdParam)

               const userFound = await User.find({ _id : userIdParam });

               return ReturnAPIResponse(res, new API_Response(
                    StatusCodes.Success,
                    userFound,
                    "Передана информация о пользователе"
               ));
          } 
          catch (e) 
          {
               Logger.error("Ошибка при получении пользователя :" + e)

               return ReturnAPIResponse(res, new API_ErrorResponse(
                    StatusCodes.InternalError,
                    KnownErrors.InternalError,
                    "Ошибка при получении пользователя по id :" + e
               ));
          }
     }
}

var controller = new UserController()
export { controller }