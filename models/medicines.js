const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
  name: {type: String},
  tokenDateMedicines: {type: Date},
  timesNumberPerDay: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Medicament', medicamentSchema);
