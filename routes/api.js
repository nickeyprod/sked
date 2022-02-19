const
  express = require('express'),
  router = express.Router(),
  Performance = require("../models/performance");

const ical = require('node-ical');

// GET api/get-perfs-statistic
router.get("/get-perfs-statistic", function (req, res, next) {
  Performance.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }])
    .exec(function (err, perfNums) {
      if (err) {
        var error = new Error("Error counting performances");
        return next(error);
      }

      const perfsNum = {
        opera: perfNums[0] ? perfNums[0].count : 0,
        ballet: perfNums[1] ? perfNums[1].count : 0
      };


      // make beautiful performances count
      for (let i = 0; i < perfNums.length; i++) {
        if (perfNums[i]._id == "opera") {
          perfsNum.opera = perfNums[i].count;
        }
        else if (perfNums[i]._id == "ballet") {
          perfsNum.ballet = perfNums[i].count;
        }
      }

      res.send({ perfsStat: perfsNum });
    });
});

// GET api/auth-status
router.get("/auth-status", function (req, res, next) {
  return res.send({ 
    authorised: req.session.userId ? true : false,
    admin: req.session.admin === true ? true : false 
  });
});

router.get("/ical", function(req, res, next) {
  const calURL = 'https://calendar.google.com/calendar/ical/cjnp0knhgufvq3q7hvs1343s1k@group.calendar.google.com/public/basic.ics';

  ical.async.fromURL(calURL, {}, (err, data) => { 
    if (err) {
      console.error(err);
      return {error: "Error requesting or parsing calendar" };
    }
    const today = new Date(Date.now());
    const year = today.getFullYear();
    const month = today.getMonth();
    const currMonthsEvents = [];

    for (let key in data) {
      const calDataStart = data[key].start;

      if (calDataStart.getFullYear() == year && calDataStart.getMonth() == month) {
        currMonthsEvents.push(
          data[key]
        );
      }
    }
    return res.send({evts: currMonthsEvents });
  });
});

module.exports = router;