const mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId;

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  by: {
    type: ObjectId,
    required: false
  }
});

module.exports = mongoose.model('User', PostSchema);