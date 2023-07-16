/**
 * namespace для констант генерации хэша, подписи токена и т.д.
 */
const security_constants = {
     tokenExpirationTime: "24h", ///< Срок действия токена
     tokenSecret: "COMMON_SECRET", ///< Секрет для работы с токеном
     hashSaltLength: 7          ///< "соль" для хэш-функции bcryptjs
}
 
 
export default security_constants