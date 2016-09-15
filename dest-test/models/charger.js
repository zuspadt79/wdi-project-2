const mongoose = require("mongoose");

const chargerSchema = mongoose.Schema({
  id:          { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  postcode:    { type: String, time: true, required: true },
  latitude:    { type: String, time: true, required: true },
  longitude:   { type: String, time: true, required: true }
});

module.exports = mongoose.model("Charger", chargerSchema);
