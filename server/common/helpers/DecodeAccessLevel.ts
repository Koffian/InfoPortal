import AccessLevel from "../AccessLevel";

export function DecodeAccessLevel(accessLevel: number)
{
     switch (accessLevel) {
          case AccessLevel.Administrator:
               return "Администратор"
          case AccessLevel.Moderator:
               return "Модератор"
          case AccessLevel.User:
               return "Обычный пользователь"
          case AccessLevel.Banned:
               return "Забаненный пользователь"
          default:
               return "Неавторизованный пользователь"
     }
}