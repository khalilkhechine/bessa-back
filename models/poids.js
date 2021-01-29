const mongoose = require('mongoose');

const poidsSchema = mongoose.Schema({
  poids: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Poids', poidsSchema);
