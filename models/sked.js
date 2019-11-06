const mongoose = require('mongoose');

const SkedSchema = new mongoose.Schema({
  dates: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('Sked', SkedSchema);