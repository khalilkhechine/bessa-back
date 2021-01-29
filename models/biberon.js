const mongoose = require('mongoose');

const biberonSchema = mongoose.Schema({
  datePriseB: {type: Date, required: true},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Biberon', biberonSchema);
