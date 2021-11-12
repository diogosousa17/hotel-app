let mongoose = require('mongoose')
let Schema = mongoose.Schema

let BedroomSchema = new Schema({
    bedroomNumber: { type: Number, required: true, unique: true },
    bedroomType: { type: String, required: true, default: "Single" },
    bedsNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true }
})

let Bedroom = mongoose.model('bedrooms', BedroomSchema)

module.exports = Bedroom