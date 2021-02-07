const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
  name: {type: String},
  tokenDate: {type: Date},
  timesNumberPerDay: {type: String},
  finished: {type: Boolean},
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Medicines', medicamentSchema);
