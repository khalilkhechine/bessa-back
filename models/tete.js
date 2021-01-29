const mongoose = require('mongoose');

const teteSchema = mongoose.Schema({
  heureTete: {type: Date},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('tete', teteSchema);
