let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nif: { type: Number, required: true, unique: true },
    // dateBirthday: { type: Date, required: true},
    address: { type: String, required: true },
    userType: { type: String, default: "Public" }
})

let User = mongoose.model('users', UserSchema)

module.exports = User