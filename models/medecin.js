const mongoose = require('mongoose');

const medecinSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  addresse: {type: String},
  specialite: {type: String, required: true}

});
module.exports = mongoose.model('Medecin', medecinSchema);




