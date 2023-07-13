const {Schema, model} = require('mongoose')

const Account = new Schema({
     username: {type: String, unique: true, required: true},
     password: {type: String, required: true},
     access: {type: Number, ref: 'AccessLevel'},
     bannedUntil: {type: Date},
     mutedUntil: {type: Date}
})

module.exports = model('Account', Account)