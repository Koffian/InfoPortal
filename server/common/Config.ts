/** Функции для работы с глобальным конфигом сервера */

const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, '../config.json');

/** Прочитать состояние сервера (не настроен / проинициализирован) */
export async function ReadServerState() {
     try {
          const data = await fs.readFileSync(configFilePath, { encoding: 'utf8', flag: 'r' });
          const state = JSON.parse(data).serverState;
          if (state === undefined)
          {
               throw console.log("Не удалось прочитать состояние сервера")
          }
          return state;
     } 
     catch (err) {
          console.log("Ошибка чтения конфига: " + configFilePath )
          return null;
     }
}

/**
 * Установить новое состояние сервера
 * @param {String} state : Новое состояние сервера 
 */
export function WriteServerState(state: String) {
     const data = {
     serverState: state,
     };
     fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export namespace ServerState {

     /** Инициализирован успешно*/
     export const initialized = "initialized"

     /** Не инициализирован */
     export const notInitialized = "notInitialized"
}