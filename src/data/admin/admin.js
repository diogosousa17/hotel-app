let mongoose = require('mongoose')
let Schema = mongoose.Schema

let AdminSchema = new Schema({
    id: {type: String, required: true, unique: true},
    password: {type: String, unique: true}
})

let Admin = mongoose.model('admins', AdminSchema)

module.exports = Admin