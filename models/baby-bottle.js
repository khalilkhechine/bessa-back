const mongoose = require('mongoose');

const BabyBottleSchema = mongoose.Schema({
  createdAt: {type: Date, required: true},
  period: {type: Number, default: 4},
  tokenBabyBottle: [{tokenDate : Date}],
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('BabyBottle', BabyBottleSchema);
