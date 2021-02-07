const mongoose = require('mongoose');

const teteSchema = mongoose.Schema({
  teteHour: {type: Date},
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('tete', teteSchema);
