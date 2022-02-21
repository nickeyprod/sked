const
  express = require('express'),
  router = express.Router();

const ical = require('node-ical');


// GET /calendars
router.get("/", function (req, res, next) {
  return res.render("calendars/main_cal", { title: "Календари Большого" });
});

// GET /calendars/repertuar
router.get("/repertuar", function (req, res, next) {
  const calURL = 'https://calendar.google.com/calendar/ical/cjnp0knhgufvq3q7hvs1343s1k@group.calendar.google.com/public/basic.ics';

  ical.async.fromURL(calURL, {}, (err, data) => {
    if (err) {
      console.error(err);
      return { error: "Error requesting or parsing calendar" };
    }

    const todayDate = new Date(Date.now());
    const year = todayDate.getFullYear();
    const currYearEvents = [];    

    for(let key in data) {
      const evStart = new Date(data[key].start);
      if (evStart.getFullYear() == year ) {
        currYearEvents.push(data[key]);
      }
    }
    currYearEvents.sort((firstEl, secondEl) => {
      return firstEl.start - secondEl.start
    });
    return res.render("calendars/repertuar", { title: "Репертуарный план", events: currYearEvents });

  });
});

module.exports = router;