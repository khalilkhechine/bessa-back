const mongoose = require('mongoose');

const vaccinSchema = mongoose.Schema({
  name: {type: String},
  datePrise: {type: Date},
  duree: {type: String},
  description: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Vaccin', vaccinSchema);
