const mongoose = require('mongoose');

const repasSchema = mongoose.Schema({
  tokenMeal: {type: Date, required: true},
  name: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('repas', repasSchema);
