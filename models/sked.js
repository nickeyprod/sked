const mongoose = require('mongoose');

const SkedSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true
  },
  from: {
    type: String,
    required: true,
    unique: true
  },
  to: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Sked', SkedSchema);