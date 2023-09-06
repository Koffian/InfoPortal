/** Статус код и ассоциируемый с ним HTTP код */
import {StatusCode as HTTP_StatusCode} from "status-code-enum";


// Неоптимально написанные классы в этом файле, ну и фиг с ним (пока что)

class StatusCode
{
     code: number
     httpCode: HTTP_StatusCode

     constructor(code: number, httpCode: HTTP_StatusCode)
     {
          this.code = code;
          this.httpCode = httpCode;
     }
}

export const StatusCodes = {
     Success: new StatusCode(0, HTTP_StatusCode.SuccessOK),
     BadRequest: new StatusCode(1, HTTP_StatusCode.ClientErrorBadRequest),
     Forbidden: new StatusCode(2, HTTP_StatusCode.ClientErrorForbidden),
     NotFound: new StatusCode(3, HTTP_StatusCode.ClientErrorNotFound),
     AlreadyExists: new StatusCode(4, HTTP_StatusCode.RedirectFound),
     InternalError: new StatusCode(4, HTTP_StatusCode.ServerErrorInternal),
}

const StatusCodeMap = new Map ([
     [0, StatusCodes.Success],
     [1, StatusCodes.BadRequest],
     [2, StatusCodes.Forbidden],
     [3, StatusCodes.NotFound],
     [4, StatusCodes.AlreadyExists],
     [5, StatusCodes.InternalError]
]);

/** Интерфейс ответа API, возвращаемого пользователю.
 * Содержит статус код, тело ответа и проч. информацию.
*/
interface IAPI_Response {
     code: number
     description: string
}

export class API_Response implements IAPI_Response 
{
     code: number;
     httpCode: number;
     body: object = {};
     description: string = "";

     constructor(statusCode: StatusCode, body?: object, optionalDescription?: string)
     {
          this.code = statusCode.code;
          this.httpCode = StatusCodeMap.get(statusCode.code)?.httpCode || 0;
          if (body){
               this.body = body;
          }
          if (optionalDescription){
               this.description = optionalDescription;
          }
     }
}


interface IError {
     code: number
     name: string
     description: string
}

/** Объект ошибки */
class KnownError implements IError
{
     code: number
     name: string
     description: string

     constructor(code: number, name: string, description: string) {
          this.code = code;
          this.name = name;
          this.description = description;
      }
};

/* Перечеисление возможных форматов публикации (по содержимому) */
export const KnownErrors = {
     NotFound: new KnownError(
          1,
          "NotFound",
          "Не найден запрашиваемый ресурс."
     ),
     InternalError: new KnownError(
          2,
          "InternallError",
          "Внутрення ошибка сервера."
     ),
     InsufficientAccess: new KnownError(
          3,
          "InsufficientAccess",
          "Нехватает прав доступа."
     ),
     DeletedOrMoved: new KnownError(
          4,
          "DeletedOrMoved",
          "Материал перемещён или удалён."
     ),
     WrongPassword: new KnownError(
          5,
          "WrongPassword",
          "Введён неверный пароль."
     ),
     AlreadyExists: new KnownError(
          6,
          "AlreadyExists",
          "Объект уже существует."
     ),
     BadParams: new KnownError(
          7,
          "BadParams",
          "Переданы некорректные аргументы."
     ),
     Forbidden: new KnownError(
          8,
          "Forbidden",
          "Доступ запрещён/ограничен."
     )
};

function DecodeError(errorCode: number)
{
     switch (errorCode) {
          case 1:
               return KnownErrors.NotFound.description;
          case 2:
               return KnownErrors.InternalError.description;
          case 3:
               return KnownErrors.InsufficientAccess.description;
          case 4:
               return KnownErrors.DeletedOrMoved.description;
          case 5:
               return KnownErrors.WrongPassword.description;
          case 6:
               return KnownErrors.AlreadyExists.description;
          default:
               return "Failed to decode";
     }
}

export class API_ErrorResponse extends API_Response
{
     errorCode: number;
     description: string = "";

     constructor(statusCode: StatusCode, error: KnownError, extraDescription?: string)
     {
          super(statusCode);
          this.errorCode = error.code;
          this.description = error.description;

          if (extraDescription){
               this.description += " " + extraDescription;
          }
     }
}