

/* Конструктор метода сортировки */
function SortingMethod(methodName : string, methodFilter : string)
{
     return {name: methodName, filter: methodFilter};
}

/** Перечеисление возможных форматов публикации (по содержимому) */
const SortingMethods = {
     karma_ascending:    SortingMethod("karma_ascending", "karmaCounter"),
     karma_descending:   SortingMethod("karma_descending", "-karmaCounter"),
     new_first:          SortingMethod("new_first", "creationDate"),
     old_first:          SortingMethod("old_first", "-creationDate"),
}

/* Сформировать метод сортировки для mongoose на основе query параметра ordrer_by */
export function GetSortingMethod(order_by: any)
{
     switch (order_by) {
          case SortingMethods.karma_ascending.name:
               return SortingMethods.karma_ascending.filter
          case SortingMethods.karma_descending.name:
               return SortingMethods.karma_descending.filter;
          case SortingMethods.new_first.name:
               return SortingMethods.new_first.filter;
          case SortingMethods.old_first.name:
               return SortingMethods.old_first.filter;
          default:
               return "_id"
     }
}