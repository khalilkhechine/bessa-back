const mongoose = require('mongoose');

const tailleSchema = mongoose.Schema({
  taille: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Taille', tailleSchema);
