const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
  name: {type: String},
  tokenDateMedicines: {type: Date},
  timesNumberPerDay: {type: String},
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Medicines', medicamentSchema);
