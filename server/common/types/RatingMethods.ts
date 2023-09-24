/** Методы оценивания контента портала пользователями */

/* Конструктор метода оценивания */
function RatingMethod(methodName : string, methodCode : number)
{
     return {name: methodName, code: methodCode};
}

/** Перечеисление возможных действий оценивания контента */
export const RatingMethods = {
     reset: RatingMethod("reset", 0),
     like: RatingMethod("like", 1),
     dislike: RatingMethod("dislike", 2),
}