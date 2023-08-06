import User from "../models/User"
import AccessLevel from "../common/AccessLevel"
import security_constants from "../common/SecurityConstants"
import Logger from "../common/Logger"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

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
                    return res.status(403).json({error:{message: "Пользователь с таким именем уже существует"}})
               }
               const hashedPassword = bcrypt.hashSync(password, 7)
               const user = new User({username, password: hashedPassword, access: AccessLevel.User})
               await user.save()

               console.log("Зарегистрирован аккаунт " + username)
               return res.status(201).json({message: "Учётка " + username + " успешно зарегистрирована с правами пользователя"})
          } 
          catch (e) {
               console.log("Ошибка регистрации пользователя: " + e)
               res.status(400).json({error:{message:'Ошибка регистрации: ' + e}})
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
                    return res.status(400).json({error:{message: 'Пользователь с именем ' + username + ' не найден'}})
               }
  
               const isValidPassword = bcrypt.compareSync(password, user.password)
               if (!isValidPassword) {
                    return res.status(400).json({error:{message: 'Введен неверный пароль'}})
               }
               const token = generateAccessToken(user._id, user.access)

               console.log("Пользователь " + username + " авторизовался и получил токен доступа: " + token)
               return res.status(200).json({token, roles: user.access})
          } 
          catch (e) {
               console.log("Авторизация пользователя завершилась с ошибкой:" + e)
               res.status(400).json({error:{message:'Login error:'}})
          }
     }

     /**
      * Администраторский функционал
      * Получение списка пользователей и возвращение клиенту
      * @param {*} req Тело запроса
      * @param {*} res Тело ответа
      */
     async GetUsers(req : any, res : any) {
          try {
               Logger.info("Администратор получает список пользователей")
               const users = await User.find()
               res.status(201).json({users})
           } 
           catch (e) {
               Logger.error("Ошибка при получении списка пользователя :" + e)
               res.status(400).json({error:{message:'Внутренняя ошибка сервера'}})
           }
       }
}

var controller = new UserController()
export { controller }