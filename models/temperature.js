const mongoose = require('mongoose');

const temperatureSchema = mongoose.Schema({

  datePrise: {type: Date, required: true},
  valeur: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Temperature', temperatureSchema);
