const 
  express = require('express'),
  router = express.Router();

// GET /notes
router.get("/", function(req, res, next) {
  return res.render("notes/notes", {title: "Заметки"});
});

module.exports = router;