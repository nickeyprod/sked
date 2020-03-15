const mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId;

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  by: {
    type: ObjectId,
    required: false
  },
  votes: {
    type: Object,
    default: {
      likedBy: [],
      dislikedBy: []
    },
    required: false
  }
});

module.exports = mongoose.model('Note', NoteSchema);