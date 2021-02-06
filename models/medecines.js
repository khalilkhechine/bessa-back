const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
  name: {type: String},
  tokenDateMedecines: {type: Date},
  timesNumberPerDay: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Medicament', medicamentSchema);
