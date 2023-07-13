/**
 * Скрипт инициализации сервера перед первым запуском
 * Создаёт администраторскую учётку со стандартным паролём (рекомендуется изменить после первого запуском)
 * Наполняет базу данных дефолтным контентом, полезным для тестирования
*/

const Account = require("#server/models/Account.js")
const AccessLevel = require("#server/common/AccessLevel.js")
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose")

const port = 5000        ///< Порт
const host = "127.0.0.1" ///< Адрес (localhost)

const databaseUrl = "mongodb://0.0.0.0:27017/portal" ///< Адрес сервера БД

const defaultAdminName = "administrator" ///< Логин админа
const defaultAdminPassword = "adminadmin"     ///< Пароль админа


const PreInitializeServer = async() =>
{
     try {

          await mongoose.connect(databaseUrl)
          
          /**
           * 1. Создание администраторской учётки
          */
         const hashedPassword = bcrypt.hashSync(defaultAdminPassword, 7)
         const account = new Account({username: defaultAdminName, password: hashedPassword, access: AccessLevel.Administrator})
         await account.save()

         console.log("Init script succeded")
         return
     }
     catch (e) {
          console.log ("Init script failed with error: " + e)
     }
}
PreInitializeServer()
