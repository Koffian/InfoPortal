const {Schema, model} = require('mongoose')

/**
 * Уровень доступа пользователя, определяющий права работы с порталом
 */
const AccessLevel = new Schema({
     value: [{type: Number}],
})

module.exports = model('AccessLevel', AccessLevel)