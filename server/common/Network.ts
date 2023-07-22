/* Конфигурация адреса хоста, базы данных и т.д.*/

export namespace Network {

     /** Ip адрес хоста*/
     export const hostAddress = "127.0.0.1"

     /** Порт, на котором слушает хост */
     export const hostPort = 5000

     /**  т.к. нет доменного имени, так строится hostName */
     export const hostName = "http://" + hostAddress + ":" + hostPort

     /** URL для работы с MongoDB */
     export const mongoURL = "mongodb://0.0.0.0:27017/portal"
}