const mongoose = require('mongoose');

const sommeilSchema = mongoose.Schema({

  sleepHour: {type: Date, required: true},
  hoursNumber: {type: String},
  selectedBebe: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('sommeil', sommeilSchema);
