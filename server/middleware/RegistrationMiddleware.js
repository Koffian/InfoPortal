const jwt = require("jsonwebtoken")
const validationResult = require('express-validator')
const bcrypt = require('bcryptjs')

const minLoginLength = 10 ///< Минимальная длина пароля
const maxLoginLength = 20 ///< Максимальная длина пароля
const minPasswordLength = 10 ///< Минимальная длина пароля
const maxPasswordLength = 20 ///< Максимальная длина пароля

/**
 * Проверка логина пользователя на корректность
 * @param {String} login Логин пользователя
 * @returns Результат проверки (true/false)
 */
function IsValidLogin (login)
{
     if (minLoginLength <= login.length && login.length  <= maxLoginLength)
     {
          return true
     }
     return false
}

/**
 * Проверка пользовательского пароля на длину
 * @param {String} plainPassword Незахешированный пароль в строковом виде
 * @returns Результат проверки (true/false)
 */
function IsValidPassword (plainPassword)
{
     if (minPasswordLength <= plainPassword.length && plainPassword.length  <= maxPasswordLength)
     {
          return true
     }
     return false
}

/**
 * Убедиться в корректности запроса регистрации, проверить пользовательские данные
 * @param {*} req Запрос
 * @param {*} res Ответ
 * @param {*} next Вызов следующего коллбека из массива
 */
function VerifyRegistrationRequest (req, res, next) {
     try {          
          if (req.body == null){
               return res.status(403).json({message: "Пустое тело запроса "})
          }

          const {username, password} = req.body
          
          if (!username || !password){
               return res.status(403).json({message: "Отсутствует логин и/или пароль"})
          }

          if (!IsValidLogin(username)){
               return res.status(403).json({message: "Неккоректный логин пользователя "})
          }

          if (!IsValidPassword(password)){
               return res.status(403).json({message: "Неккоректный пароль пользователя "})
          }

          next()
     }
     catch (e) {
          console.log("Ошибка middleware: " + e)
          return res.status(403).json({error: {message: "Не удалось зарегистрировать пользователя: " + e}})
     }
}

module.exports = VerifyRegistrationRequest