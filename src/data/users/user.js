let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { default: "publico", type: ["admin", "publico"] },
  nif: { type: Number, required: true, unique: true },
  dateBirthday: { type: Date, required: true },
  phoneNumber: { type: Number, required: true },
  address: { type: String, required: true },
  userType: { type: String, default: "Public" },
  reserves: [
    {
      reserveNumber: { type: Number, required: true, unique: true },
      extras: { type: String, required: true },
      bedroom: {
        bedroomNumber: { type: Number, required: true },
        bedroomType: { type: String, required: true, default: "Single" },
        bedsNumber: { type: Number, required: true },
        capacity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
      nightsNumber: { type: Number, required: true },
      date: { type: Date, required: true },
      finalPrice: { type: Number, required: true },
      reserveType: {
        type: ["pequeno-almoço", "pensão completa"],
        required: true,
      },
      guestsNumber: { type: Number, required: true },
    },
  ],
});

let User = mongoose.model("users", UserSchema);

module.exports = User;
