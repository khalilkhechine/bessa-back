const mongoose = require('mongoose');

const bebeSchema = mongoose.Schema({
  name: {type: String, required: true},
  birthDay: {type: Date, required: true},
  gender: {type: String, required: true},
  weight: {type: String},
  photo: {type: String},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});
module.exports = mongoose.model('Bebe', bebeSchema);
