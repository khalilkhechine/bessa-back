const mongoose = require('mongoose');

const coucheSchema = mongoose.Schema({
  dateUtilisation: {type: Date, required: true},
  duree: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Couche', coucheSchema);
