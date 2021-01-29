const mongoose = require('mongoose');

const repasSchema = mongoose.Schema({
  datePriseR: {type: Date, required: true},
  nom: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('repas', repasSchema);
