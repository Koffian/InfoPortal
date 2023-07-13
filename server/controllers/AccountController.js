const Account = require("#server/models/Account.js")
const AccessLevel = require("#server/common/AccessLevel.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const security_constants = require("#server/common/SecurityConstants.js")
const Logger = require("#server/common/Logger.js")

/**
 * Генерация токена доступа пользователя
 * @param {*} id ID пользователя
 * @param {*} accessLevel Уровень доступа пользователя
 * @returns Подписанный токен
 */
const generateAccessToken = (id, accessLevel) => {
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
class AccountController
{
     /**
      * Регистрация новой учётной записи с правами обычного пользователя (User)
      * @param {*} req Тело запроса
      * @param {*} res Тело ответа
      * @returns Респонс с кодом 201 при успешном добавлении, коды 400-403 при ошибках
      */
     async RegisterAccount(req, res) {
          try 
          {
               const {username, password} = req.body
               const candidate = await Account.findOne({username})
               if (candidate) {
                    return res.status(403).json({error:{message: "Пользователь с таким именем уже существует"}})
               }
               const hashedPassword = bcrypt.hashSync(password, 7)
               const account = new Account({username, password: hashedPassword, access: AccessLevel.User})
               await account.save()

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
     async LogIn(req, res) {
          try {
               const {username, password} = req.body
               const account = await Account.findOne({username})
               if (!account) {
                    return res.status(400).json({error:{message: 'Пользователь с именем ' + username + ' не найден'}})
               }
  
               const isValidPassword = bcrypt.compareSync(password, account.password)
               if (!isValidPassword) {
                    return res.status(400).json({error:{message: 'Введен неверный пароль'}})
               }
               const token = generateAccessToken(account._id, account.access)

               console.log("Пользователь " + username + " авторизовался и получил токен доступа")
               return res.status(200).json({token, roles: account.access})
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
     async GetAccounts(req, res) {
          try {
               Logger.info("Администратор получает список пользователей")
               const users = await Account.find()
               res.status(201).json({users})
           } 
           catch (e) {
               Logger.error("Ошибка при получении списка пользователя :" + e)
               res.status(400).json({error:{message:'Внутренняя ошибка сервера'}})
           }
       }
}

module.exports = new AccountController()