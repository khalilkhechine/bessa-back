const mongoose = require('mongoose');

const DiaperSchema = mongoose.Schema({
  createdAt: {type: Date, required: true},
  period: {type: Number, default: 4},
  usedDiaper: [{usedDate : Date}],
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Diaper', DiaperSchema);
