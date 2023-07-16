import {Schema} from 'mongoose'
import { connection } from '../mongoConnection'

const AccountSchema = new Schema({
     username: {type: String, unique: true, required: true},
     password: {type: String, required: true},
     access: {type: Number, ref: 'AccessLevel'},
     bannedUntil: {type: Date},
     mutedUntil: {type: Date}
})

const Account = connection.model("Account", AccountSchema)
export default Account