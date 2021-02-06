const mongoose = require('mongoose');

const poidsSchema = mongoose.Schema({
  weight: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Poids', poidsSchema);
