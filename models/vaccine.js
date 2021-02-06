const mongoose = require('mongoose');

const vaccineSchema = mongoose.Schema({
  name: {type: String},
  createdAt: {type: Date},
  vaccineDates: [{vaccineDate: Date}],
  period: {type: String},
  description: {type: String},
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Vaccine', vaccineSchema);
