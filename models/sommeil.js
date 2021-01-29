const mongoose = require('mongoose');

const sommeilSchema = mongoose.Schema({

  heureSommeil: {type: Date, required: true},
  nbreHeureq: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('sommeil', sommeilSchema);
