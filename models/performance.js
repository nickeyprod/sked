const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  acts: {
    type: Array,
    required: true
  },
  points: {
    type: Object,
    default: {},
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  imgUrl: {
    type: String,
    required: false
  }
});


module.exports = mongoose.model('Performance', PerformanceSchema);