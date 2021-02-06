const mongoose = require('mongoose');

const medecinSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  address: {type: String},
  specialty: {type: String, required: true}

});
module.exports = mongoose.model('Doctor', medecinSchema);




