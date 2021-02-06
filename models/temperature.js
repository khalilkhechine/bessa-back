const mongoose = require('mongoose');

const temperatureSchema = mongoose.Schema({

  tokenDateTempreture: {type: Date, required: true},
  value: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Temperature', temperatureSchema);
