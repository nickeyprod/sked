const
  express = require('express'),
  router = express.Router();

const ical = require('node-ical');


// GET /calendars
router.get("/", function (req, res, next) {
  return res.render("calendars/main_cal", { title: "Календари Большого" });
});

module.exports = router;