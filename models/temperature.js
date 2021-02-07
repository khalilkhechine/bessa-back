const mongoose = require('mongoose');

const temperatureSchema = mongoose.Schema({
  metering: [{
    date: Date,
    temperature: Number
  }],
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}

});
module.exports = mongoose.model('Temperature', temperatureSchema);
