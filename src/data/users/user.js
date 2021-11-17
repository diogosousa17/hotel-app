let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nif: { type: Number, required: true, unique: true },
  // dateBirthday: { type: Date, required: true},
  telemovel: { type: Number, required: true },
  address: { type: String, required: true },
  userType: { type: String, default: "Public" },
  reservas: [
    {
      numeroReserva: { type: Number, required: true, unique: true },
      extras: { type: String, required: true },
      quarto: {
        bedroomNumber: { type: Number, required: true },
        bedroomType: { type: String, required: true, default: "Single" },
        bedsNumber: { type: Number, required: true },
        capacity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
      numeroNoites: { type: Number, required: true },
      data: { type: Date, required: true },
      valorTotal: { type: Number, required: true },
      tipoReserva: {
        type: ["pequeno-almoço", "pensão completa"],
        required: true,
      },
      numeroHospedes: { type: Number, required: true },
    },
  ],
});

let User = mongoose.model("users", UserSchema);

module.exports = User;
