const mongoose = require('mongoose');

const GrowthSchema = mongoose.Schema({
  growthing: [{
    date: Date,
    height: Number,
    weight: Number,
  }],
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Growth', GrowthSchema);
