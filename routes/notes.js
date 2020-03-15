const
  express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  mid = require("../middleware/middleware"),
  Note = require("../models/note");

// GET /notes
router.get("/", function (req, res, next) {
  return res.render("notes/notes", { title: "Заметки" });
});

// GET /notes/upload-ten
router.get("/upload-ten", function (req, res, next) {
  let sort;
  if (req.query.sort) {
    sort = req.query.sort;
  } else {
    sort = -1;
  }
  console.log(req.query);
  Note.aggregate([{ $match: {} }, {
    $lookup: {
      from: "users",
      localField: "by",
      foreignField: "_id",
      as: "user"
    }
  }, { $unwind: "$user" }, { $sort: { _id: Number(sort) } }, { $limit: 10 }]).exec(function (err, notes) {
    if (err) {
      res.status(500);
      res.statusMessage = "Error during searching notes";
      return res.send();
    }

    return res.send({ notes: notes });
  });
});


// POST /notes/publish-note
router.post("/publish-note", mid.authorised, function (req, res, next) {
  const text = req.body.text;

  if (!text) {
    res.status(500);
    res.statusMessage = "No message text found";
    return res.send();
  }

  Note.create({ text: text, by: mongoose.Types.ObjectId(req.session.userId) }, function (err, note) {
    if (err) {
      res.status(500);
      res.statusMessage = "Error during creating the note";
      return res.send();
    }
    res.status(200);
    res.statusMessage = "Published";
    res.send();
  });
});

// POST /notes/vote
router.post("/vote", mid.authorised, function (req, res, next) {
  const typeOfVote = req.body.typeOfVote;
  const noteId = req.body.noteId;

  if (!typeOfVote || !noteId) {
    res.status(500);
    res.statusMessage = "Bad request";
    return res.send();
  }

  let checkCondition, action;
  if (typeOfVote === "like") {
    checkCondition = { "_id": noteId, "votes.likedBy": { $in: [mongoose.Types.ObjectId(req.session.userId)] } };
  }
  else if (typeOfVote === "dislike") {
    checkCondition = { "_id": noteId, "votes.dislikedBy": { $in: [mongoose.Types.ObjectId(req.session.userId)] } }
  }

  Note.find(checkCondition, (err, n) => {
    if (err) {
      res.status(500);
      res.statusMessage = "Couldn't update vote";
      return res.send();
    }

    if (typeOfVote === "like") {
      if (n.length == 0) {
        action = { $pull: { "votes.dislikedBy": mongoose.Types.ObjectId(req.session.userId) }, $addToSet: { "votes.likedBy": mongoose.Types.ObjectId(req.session.userId) } };
      } else {
        action = { $pull: { "votes.likedBy": mongoose.Types.ObjectId(req.session.userId) } };
      }
    } else if (typeOfVote === "dislike") {
      if (n.length == 0) {
        action = { $pull: { "votes.likedBy": mongoose.Types.ObjectId(req.session.userId) }, $addToSet: { "votes.dislikedBy": mongoose.Types.ObjectId(req.session.userId) } };
      } else {
        action = { $pull: { "votes.dislikedBy": mongoose.Types.ObjectId(req.session.userId) } };
      }
    }

    Note.updateOne({ _id: noteId }, action, function (err, result) {
      if (err) {
        res.status(500);
        res.statusMessage = "Couldn't update vote";
        return res.send();
      }
      Note.findById(noteId, (err, note) => {
        if (err) {
          res.status(500);
          res.statusMessage = "Couldn't update vote";
          return res.send();
        }

        res.status(200);
        res.statusMessage = "OK";
        res.send({ note: note });
      });
    });
  });
});

module.exports = router;