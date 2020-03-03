const mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId;

const AdminSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Admin', AdminSchema);