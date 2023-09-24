/** Получить, насколько данный вид оценки влияет на карму*/
import { RatingMethods } from "../types/RatingMethods";
import { UserReactionFlags } from "../types/UserReactionFlags";
import User from "../../models/User"

/** TODO: Вообще можно было бы сделать перегрузку аргументов функции или сделать через шаблоны, но и так сойдет */

/// 1. Методы работы с флагом реакции

/** Проверить, оценивал ли авторизированный пользователь данный пост и получить флаг реакции. Полезно для Front-End*/
export async function GetRequestorReactionFlag(req: any, targetId: any)
{
     const user: any = await User.findById(req.requestorUserId)
     for (let i = 0; i < user?.reactionList.length; i++)
     {
          const reaction =  user?.reactionList[i]
          console.log(reaction.targetId + " == " + targetId + " ?")
          if (reaction.targetId == targetId)
          {
               console.log("Already rated by this user (document)")
               return reaction.reactionType;
          }
     }
     console.log("Was not rated by logged in user yet")
     return UserReactionFlags.NotReacted; 
}

/** Проверить, оценивал ли произвольный пользователь данный элемент и вернуть флаг реакции. Больше для внутреннего применения*/
export async function GetReactionFlagFromUserDocument(userDocument: any, targetId: any)
{
     for (let i = 0; i < userDocument?.reactionList.length; i++)
     {
          const reaction = userDocument?.reactionList[i]
          console.log(reaction.targetId + " == " + targetId + " ?")
          if (reaction.targetId == targetId)
          {
               console.log("Already rated by this user (document), abort")
               return reaction.reactionType;
          }
     }
     console.log("Was not rated by this user (document) yet")
     return UserReactionFlags.NotReacted; 
}

/** Получить, насколько влияет существующая оценка на карму поста */
export function GetExistingKarmaAffection(reactionFlag: number)
{
     switch (reactionFlag)
     {
          case UserReactionFlags.NotReacted:
               return 0;
          case UserReactionFlags.ReactedNegatively:
               return -1;
          case UserReactionFlags.ReactedPositively:
               return 1;
          default:
               return 0;
     }
}

/// 2. Механизмы оценивания контента

/** Получить, каким образом применяемый метод оценивания повлияет на карму оцениваемого элемента */
export function GetRatingMethodKarmaAffection(code: number)
{
     switch (code)
     {
          case RatingMethods.reset.code:
               return 0;
          case RatingMethods.like.code:
               return 1;
          case RatingMethods.dislike.code:
               return -1;
          default:
               return 0
     }
}

/** Получить код метода оценивания по его строковому названию */
export function GetRatingMethodCode(methodName: String)
{
     switch (methodName) {
          case RatingMethods.reset.name:
               return RatingMethods.reset.code;
          case RatingMethods.like.name:
               return RatingMethods.like.code
               case RatingMethods.dislike.name:
                    return RatingMethods.dislike.code
          default:
               return undefined
     }
}

/** Оставить реакцию на элемент (пост/комментарий) */
export async function ReactToElement(userDocument: any, elementDocument: any, ratingCode: number)
{
     try 
     {
          /// 1. Поиск, существует ли реакция на пост
          const reactionFlag = await GetReactionFlagFromUserDocument(userDocument, elementDocument.id)
          
          console.log("Пользователь " + userDocument.username + " Оценивает элемент " + elementDocument.id)
          
          console.log(reactionFlag + " == " + ratingCode + " ?: " + (reactionFlag == ratingCode))

          if (reactionFlag == ratingCode)
          {
               console.log("Обнаружено дублирование существующей операции. Флаг " + reactionFlag + " не будет заменён таким же значением")
               return 1;
          }
          
          // difference: |+0|+1|-1| минус существующуе |0|+1|-1|

          let karmaDiff = GetRatingMethodKarmaAffection(ratingCode) - GetExistingKarmaAffection(reactionFlag)
          
          /// 1. Добавление новой реакции, если до этого реакции на элемент не существовало
          if (reactionFlag === UserReactionFlags.NotReacted)
          {
               console.log("Добавляем новую реакцию на элемент: " + karmaDiff)
               elementDocument.karmaCounter += karmaDiff
               /// Убедиться, работает ли здесь это
               userDocument.reactionList.push({reactionType: ratingCode, targetId: elementDocument.id})
          }
          /// 2. Сброс реакции, если пользователь выбрал такое действие
          else if (ratingCode === RatingMethods.reset.code)
          {
               let index = -1
               for (let i = 0; i < userDocument.reactionList.length; i++)
               {
                    if (userDocument.reactionList.at(i)?.targetId == elementDocument.id)
                    {
                         /// Сбросить реакцию на контент. Удалить из списка реакций
                         index = i
                         break;
                    }
               }
               if (index > -1) {
                    userDocument.reactionList.splice(index, 1)
               }
               console.log("Изменяем карму элемента после удаления реакции: " + karmaDiff)
               elementDocument.karmaCounter += karmaDiff
          }
          /// 3. Изменение существующей реакции
          else
          {
               let index = -1
               for (let i = 0; i < userDocument.reactionList.length; i++)
               {
                    if (userDocument.reactionList.at(i)?.targetId == elementDocument.id)
                    {
                         /// Поменять реакцию на контент. Удалить из списка реакций
                         index = i
                         console.log("Updating reaction " + i)
                         break;
                    }
               }
               if (index > -1) {
                    userDocument.reactionList.at(index).reactionType = ratingCode
               }
               console.log("Изменяем карму элемента после обновления реакции: " + karmaDiff)
               elementDocument.karmaCounter += karmaDiff
          }
          await userDocument.save()
          await elementDocument.save()

          return 0
     } 
     catch (error) 
     {
          console.log("Ошибка в хэлпере работы с реакциями : " + error)
     }
}