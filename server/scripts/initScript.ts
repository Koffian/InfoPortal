/**
 * Скрипт инициализации сервера перед первым запуском
 * Создаёт администраторскую учётку со стандартным паролём (рекомендуется изменить после первого запуском)
 * Наполняет базу данных дефолтным контентом, полезным для тестирования
*/
import AccessLevel from "../common/AccessLevel"
import bcrypt from 'bcryptjs'
import mongoose from "mongoose"

import { Network } from "../common/Network"
import { ContentTypes, PostFormats, PostTypes } from "../common/PostTypes"
import { ReadServerState, WriteServerState, ServerState } from "../common/Config"

import User from "../models/User"
import Tag from "../models/Tag"
import Post from "../models/Post"


import { generateUsername } from "unique-username-generator";


const defaultAdminName = "administrator" ///< Логин админа
const defaultAdminPassword = "adminadmin"     ///< Пароль админа

/** Тестовый пароль!. Удалить в продакшне */
const defaultTestPassword = "11111111"

/** Число создаваемых тестовых пользователей */
export const testUserCount = 50;

/** Проинициализировать сервер и наполнить базу данных примерными данными */
const InitializeServer = async() =>
{
     const serverState = await ReadServerState()
     if (serverState === ServerState.initialized)
     {
          // Не выполнять скрипт если уже проинициализирован сервер
          console.log("initScript: Сервер уже проинициализирован, ничего не делаем")
     }
     else if (serverState === ServerState.notInitialized)
     {
          console.log("initScript: Инициализируем сервер + БД ...")
          WriteServerState(ServerState.initialized)
     }

     try {

          await mongoose.connect(Network.mongoURL)
          
          /** 1. Создание администраторской учётки*/
         const hashedPassword = bcrypt.hashSync(defaultAdminPassword, 7)
         const user = new User({username: defaultAdminName, password: hashedPassword, access: AccessLevel.Administrator})
         await user.save()

          /** 2. Создание тестовых пользователей*/
          let randomTestUser : mongoose.Document = user;
          for (let i = 0; i < testUserCount; i ++)
          {
               const randomUsername = generateUsername()
               const defaultHashedPassword = bcrypt.hashSync(defaultTestPassword, 7)
               randomTestUser = new User({username: randomUsername, password: defaultHashedPassword, access: AccessLevel.User})
               await randomTestUser.save()
          }

          /** 3. Создание тегов */
          let newTag = new Tag({name: "Тестирование", description: "Тестовый тег для проверки API. Таким тегом снабжжаются тестовые посты, созданные тестовыми пользователями"})
          await newTag.save()

          newTag = new Tag({name: "Тестирование-2", description: "Ещё один тег для разнообразия тестирования"})
          await newTag.save()

          /** 4. Создание тестовых постов (с помощью учётки последнего созданного тестового пользователя)*/
          let testPost = new Post({
               title: "Тестовый пост",
               type: PostTypes.Article,
               format: PostFormats.Case,
               createdBy: randomTestUser._id,
               body: [
                    {
                         type: ContentTypes.Paragraph,
                         content: "Это простой тестовый параграф"
                    },
                    {
                         type: ContentTypes.Quote,
                         content: "Нет чувства сильнее, чем начинать сначала! (С) - "
                    }
               ]
          })

          await testPost.save()
         console.log("Скрипт инициализации успешно завершился")
         return;
     }
     catch (e) {
          console.log ("Ошибка инициализации сервера: " + e)
     }
}

InitializeServer()