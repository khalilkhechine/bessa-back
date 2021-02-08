const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  address: {type: String},
  specialty: {type: String, required: true},
  appointments: [{appointment: Date}],
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});
module.exports = mongoose.model('Doctor', doctorSchema);




