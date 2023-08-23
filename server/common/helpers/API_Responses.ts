/* Тела общепринятых API респонсов (ошибка, успех и т.д) */

interface IErrorResponse {
     code: number
     name: string
     description: string
}

/**
 * Объект ошибки, возвраащемый клиенту
 */
class ErrorResponseBody implements IErrorResponse
{
     code: number
     name: string
     description: string

     /**
      * 
      */
     constructor(code: number, name: string, description: string) {
          this.code = code;
          this.name = name;
          this.description = description;
      }
};

/* Перечеисление возможных форматов публикации (по содержимому) */
export const ErrorCodes = {
     NotFound: new ErrorResponseBody(
          0,
          "NotFound",
          "Не найден запрашиваемый ресурс"
     ),
     InternalError: new ErrorResponseBody(
          1,
          "InternallError",
          "Внутрення ошибка сервера"
     ),
     InsufficientAccess: new ErrorResponseBody(
          2,
          "InsufficientAccess",
          "Нехватает прав доступа."
     ),
     DeletedOrMoved: new ErrorResponseBody(
          3,
          "DeletedOrMoved",
          "Материал перемещён или удалён"
     )
};