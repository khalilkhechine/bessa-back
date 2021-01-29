const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
  nom: {type: String},
  datePriseM: {type: Date},
  nbreDePriseParJour: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Medicament', medicamentSchema);
