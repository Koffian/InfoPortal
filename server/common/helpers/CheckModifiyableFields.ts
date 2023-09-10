/*Проверить принятые поля класса на корректность. */

import { Request, response } from "express"
import AccessLevel from "../AccessLevel"
import { ObjectId } from "mongodb"

/*Интерфейс поля, которое может быть модифицировано пользователем */
interface ModifiyableField
{
     fieldName: string             /*Название поля */
     fieldType: any                /*Ожидаемый тип поля */
     ownershipRequied: boolean     /*Нужна ли проверка на владение пользователем */
     canBeModifiedBy: Array<number>         /*Уровни доступа, дающие возможность модификации без владения */
}

/* Поле, которое возможно модифицировать пользователем, согласно условиям */
class PostModifiyableField implements ModifiyableField
{
     fieldName: string
     fieldType: any
     ownershipRequied: boolean 
     canBeModifiedBy: Array<number>

     constructor(fieldname: string, fieldType: any, ownershipRequired: boolean, canBeModifiedBy: Array<number>)
     {
          this.fieldName = fieldname
          this.fieldType = fieldType
          this.ownershipRequied = ownershipRequired
          this.canBeModifiedBy = canBeModifiedBy
     }
}

const PostModifiyableFields = {
     title: new PostModifiyableField("title", String(), true, [AccessLevel.Moderator, AccessLevel.Administrator]),
     type: new PostModifiyableField("type", Number(), true, [AccessLevel.Moderator, AccessLevel.Administrator]),
     format: new PostModifiyableField("format", Number(), true, [AccessLevel.Moderator, AccessLevel.Administrator]),
     body: new PostModifiyableField("body", Object(), true, [AccessLevel.Moderator, AccessLevel.Administrator]),
     isRestricted: new PostModifiyableField("isRestricted", Boolean(), true, [AccessLevel.Moderator, AccessLevel.Administrator]),
     tags: new PostModifiyableField("tags", Array(), true, [AccessLevel.Moderator, AccessLevel.Administrator]),
}


/// Не проверяет на NULL

/* Проверить модифицируемые поля поста на валидность и права модификации */
/*
     Правила
     Полей может не хватать.
     Нельзя передавать лишния поля, не определенные интерфейсом сущности
 */
export function CheckPostModifyableFields(req: any, isCreating: boolean = false)
{
     /* Получить из тела запроса уровень доступа и флаг владения (устанавливается предыдущим middleware) */
     const accessLevel: number = req.accessLevel;
     const ownershipFlag: boolean = req.ownershipFlag

     
     if (accessLevel === undefined)
     {
          console.log("Не установлен уровень доступа пользователя");
          throw Error("Не установлен уровень доступа пользователя");
     } 
     if (ownershipFlag === undefined)
     {
          console.log("Не установлен  флаг владения ресурсом");
          throw Error("Не установлен флаг владения ресурсом");
     }
     
     delete req["accessLevel"]
     delete req["ownershipFlag"]
     
     const recievedFields = req.body
     console.log("Приняты поля: ")
     console.log(recievedFields)
     
     if (isCreating)
     {
          const expectedFieldCount = Object.entries(PostModifiyableFields).length

          if (Object.entries(recievedFields).length != expectedFieldCount)
          {
               let errorMessage = "Не заполнено достаточное число полей. Ожидается:" + expectedFieldCount + ":";
               console.log(errorMessage);
               for (const possibleField of Object.entries(PostModifiyableFields))
               {
                    errorMessage += possibleField[1].fieldName + ": " + possibleField[1].fieldType;
               }
               throw Error(errorMessage)
          }
     }

     for (const [field, value] of Object.entries(recievedFields))
     {
          let found = false;
          for (const possibleField of Object.entries(PostModifiyableFields))
          {
               console.log("Сравниваем: " + field + " === " + possibleField[1].fieldName + " ?")
               if (field === possibleField[1].fieldName)
               {

                    /// 1. Проверка на права изменения. Разрешить, если пользователь - владелец, или права разделяются с админом/модератором
                    if (possibleField[1].ownershipRequied === true)


                    {
                         if ( ! possibleField[1].canBeModifiedBy.includes(accessLevel)
                              && ownershipFlag === false)
                         {
                              console.log("Недостаточно прав доступа для модификации поля " + field  + ": " + value);
                              throw Error("Недостаточно прав доступа для модификации поля " + field  + ": " + value)
                         }
                    }

                    /// 2. Проверка на тип
                    if (!(typeof(value) === typeof(possibleField[1].fieldType)))
                    {
                         console.log("Несоответствие типов " + field + ": " + value  + ";\t" + typeof(value) + " не соответствует ожидаемому: " + typeof(possibleField[1].fieldType));
                         throw Error("Несоответствие типов "  + field + ": " + value  + ";\t" + typeof(value) + " не соответствует ожидаемому: " + typeof(possibleField[1].fieldType));
                    }

                    console.log("Корректное поле: " + field + ": " + value)
                    found = true
                    break;
               }
          }
          if (!found)
          {
               console.log("Передано лишнее поле " + field + ": " + value  + ", не найденное в описанных")
               throw Error("Передано лишнее поле " + field + ": " + value  + ", не найденное в описанных")
          }
     }
     console.log("Упешно проверены поля")
}