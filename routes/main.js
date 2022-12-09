const 
  express = require('express'),
  router = express.Router(),
  Dates = require("calendar-dates"),
  cDates = new Dates(),
  mid = require("../middleware/middleware"),
  Sked = require("../models/sked"),
  User = require("../models/user"),
  Admin = require("../models/admin"),
  Performance = require("../models/performance"),
  isObEmpty = require("../helpers/helpers").isObEmpty;

// GET /
router.get("/", function(req, res, next) {
  return res.redirect("/performances");
});

// GET /performances
router.get("/performances", function(req, res, next) {
  Performance.aggregate([{$group: {_id: "$type", count: {$sum: 1}}}])
  .exec(function(err, perfNums) {
    if(err) {
      var error = new Error("Error counting performances");
      return next(error);
    }

    let perfsNum = {
        opera: perfNums[0] ? perfNums[0].count : 0, 
        ballet: perfNums[1] ? perfNums[1].count: 0
      };
   

    // make beautiful performances count
    for(let i=0; i<perfNums.length; i++) {
      if(perfNums[i]._id == "opera") {
        perfsNum.opera = perfNums[i].count;
      }
      else if(perfNums[i]._id == "ballet") {
        perfsNum.ballet = perfNums[i].count;
      }
    }
  
    Performance.find().exec(function(err, performances) {
      if(err) {
        var error = new Error("Error searching performances");
        return next(error);
      }
      return res.render("performances", {title: "Спектакли", performances: performances, perfsNum: perfsNum});
    });
  });
});

// POST /perfomances
router.post("/performances", mid.isAdmin, function(req, res, next) {
  if (req.session.admin !== true) {
    res.status(403);
    res.statusMessage = "Forbidden";
    res.setHeader("statusMessage", "Forbidden");
    return res.send();
  }
  const name = req.body.name;
  const type = req.body.type;
  const imgUrl = req.body.imgUrl;
  const acts = req.body.acts;
  var points = req.body.points; 
  const notes = req.body.notes;
  const perfId = req.body.perfId;
  const action = req.body.action;

  if(isObEmpty(points.leftSide) && isObEmpty(points.rightSide)) {
    points = "";
  } else {
    // if any side have empty points, delete them
    for (const point in points.leftSide) {
      if(points.leftSide[point].stalls == "/") {
        delete points.leftSide[point];
      }
    }
    
    for(const point1 in points.rightSide) {
      if(points.rightSide[point1].stalls == "/") {
        delete points.rightSide[point1];
      }
    }
  }
  if(action !== "remove") {
    if(!name || !type || !acts) {
      res.status(500);
      res.statusMessage = "Incosistent data";
      res.setHeader("statusMessage", "Incosistent data");
      return res.send();
    }
  }

  if(perfId && action === "update") {
    Performance.updateOne({_id: perfId}, {$set: {
      name: name, 
      type: type, 
      imgUrl: imgUrl,
      acts: acts, 
      points: points,
      notes: notes}}, function(err, status) {
        if(err) {
          res.status(500);
          res.statusMessage = "Error during updating performance";
          res.setHeader("statusMessage", "Error during updating performance");
          return res.send()
        }
        res.status(200);
        res.statusMessage = "OK";
        res.setHeader("statusMessage", "OK");
        return res.send();
      });
  } else if(perfId && action === "remove") {
    Performance.deleteOne({_id: perfId}, function(err, result) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during deleting performance";
        res.setHeader("statusMessage", "Error during updating performance");
        return res.send()
      }
      res.status(200);
      res.statusMessage = "OK";
      res.setHeader("statusMessage", "OK");
      return res.send();
    });
  } else if(!perfId && action === "create") {
    Performance.create({
      name: name,
      type: type,
      imgUrl: imgUrl,
      acts: acts,
      points: points, 
      notes: notes }, function(err, perf) {
        if(err) {
          res.status(500);
          res.statusMessage = "Error during creating performance";
          res.setHeader("statusMessage", "Error during creating performance");
          return res.send();
        }
        res.status(200);
        res.statusMessage = "OK";
        res.setHeader("statusMessage", "OK");
        return res.send();
      });
  }
});


// POST /perf-search
router.post("/perf-search", function(req, res, next) {
  if(!req.body.query) {
    res.status(500);
    res.statusMessage = "Bad request, search query absent";
    res.setHeader("statusMessage", "Bad request, search query absent");
    return res.send();
  }
  let query = new RegExp("^"+req.body.query, "i");

  Performance.aggregate([{$match: {name: {$regex: query}}}, {$sort: {name: 1}}]).exec(function(err, perfs) {
    if(err) {
  
      res.status(500);
      res.statusMessage = "Error during perfomance search";
      res.setHeader("statusMessage", "Error during perfomance search");
      return res.send();
    }
    res.status(200);
    res.statusMessage = "OK";
    res.setHeader("statusMessage", "OK");
    return res.send({perfs: perfs})
  });
});

// GET /sked
router.get("/sked", function(req, res, next) {
  User.find({}, function(err, workers) {
    if(err) {
      var error = new Error("Error searching users");
      return next(error);
    }
    // find sked by date day
    Sked.find({}).limit(50).exec(function (err, skeds) {
      if(err) {
        var error = new Error("Error searching sked");
        return next(error);
      }
      console.log(skeds);
      return res.render("sked", {title: "График дежурств", workers: workers, skeds: skeds})
    });
  });
});

// POST /sked
router.post("/sked", function(req, res, next) {
 
  if(req.body.from == "LAST") {
    Sked.find({}).sort({_id:-1}).limit(1).exec(function(err, sked) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during searching last sked";
        res.setHeader("statusMessage", "Error during searching last sked");
        return res.send();
      }
      if (sked.length == 0) {

      }
      // find prev
      Sked.findOne({to: sked[0].from}, function(err, prevSked) {
        if(err) {
          res.status(500);
          res.statusMessage = "Error during searching previous sked";
          res.setHeader("statusMessage", "Error during searching previous sked");
          return res.send();
        }
        // find next
        Sked.findOne({from: sked[0].to}, function(err, nextSked) {
          if(err) {
            res.status(500);
            res.statusMessage = "Error during searching previous sked";
            res.setHeader("statusMessage", "Error during searching previous sked");
            return res.send();
          }
          const prev = prevSked ? true : false;
          const next = nextSked ? true : false;
          // get dates
          var mainAsync = async () => {
          var calendates = await cDates.getDates(new Date(sked[0].from));
            res.status(200);
            res.statusMessage = "FOUND";
            res.setHeader("statusMessage", "FOUND");
            return res.send({sked: sked[0], dates:calendates, prev: prev, next: next});
          };
          mainAsync();
        });
      });
    });
  }

  else if (req.body.to) {
    Sked.findOne({to: req.body.to}, function(err, sked) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during searching sked";
        res.setHeader("statusMessage", "Error during searching sked");
        return res.send();
      }
      // find previous
      Sked.findOne({to: sked.from}, function(err, prevSked) {
        if(err) {
          res.status(500);
          res.statusMessage = "Error during searching previous sked";
          res.setHeader("statusMessage", "Error during searching previous sked");
          return res.send();
        }
        // find next
        Sked.findOne({from: sked.to}, function(err, nextSked) {
          if(err) {
            res.status(500);
            res.statusMessage = "Error during searching previous sked";
            res.setHeader("statusMessage", "Error during searching previous sked");
            return res.send();
          }
          const prev = prevSked ? true : false;
          const next = nextSked ? true : false;
            // get dates
          var mainAsync = async () => {
            var calendates = await cDates.getDates(new Date(sked.from));
            res.status(200);
            res.statusMessage = "FOUND";
            res.setHeader("statusMessage", "FOUND");
            return res.send({sked: sked, dates:calendates, prev: prev, next: next});
          };
          mainAsync();
        });
      });
    });
  }
  else {
    Sked.findOne({from: req.body.from}, function(err, sked) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during searching sked";
        res.setHeader("statusMessage", "Error during searching sked");
        return res.send();
      }
      // if no sked found, return just dates
      if(!sked) {
        // get dates
        var mainAsync = async () => {
          var calendates = await cDates.getDates(new Date(req.body.from));
          res.status(200);
          res.statusMessage = "FOUND";
          res.setHeader("statusMessage", "FOUND");
          return res.send({from: req.body.from, dates: calendates});
        };
        mainAsync();
      } else {
        // find previous
        Sked.findOne({to: sked.from}, function(err, prevSked) {
          if(err) {
            res.status(500);
            res.statusMessage = "Error during searching previous sked";
            res.setHeader("statusMessage", "Error during searching previous sked");
            return res.send();
          }
          // find next
          Sked.findOne({from: sked.to}, function(err, nextSked) {
            if(err) {
              res.status(500);
              res.statusMessage = "Error during searching previous sked";
              res.setHeader("statusMessage", "Error during searching previous sked");
              return res.send();
            }
            const prev = prevSked ? true : false;
            const next = nextSked ? true : false;
            // get dates
            var mainAsync = async () => {
              var calendates = await cDates.getDates(new Date(sked.from));
              res.status(200);
              res.statusMessage = "FOUND";
              res.setHeader("statusMessage", "FOUND");
              return res.send({sked: sked, dates:calendates, prev: prev, next: next});
            };
            mainAsync();
          });
        });
      }
    });
  }
});

// POST /save-sked
router.post("/save-sked", function(req, res, next) {
  var skedState = JSON.parse(req.body.state);
  Sked.find({from: req.body.from, to: req.body.to}, function(err, sked) {
    if(err) {
      res.status(500);
      res.statusMessage = "Error during searching by date";
      res.setHeader("statusMessage", "Error during searching by date");
      return res.send();
    }
    if(sked.length == 0) {
      Sked.create({data: skedState, from: req.body.from, to: req.body.to}, function(err, sked) {
        if(err) {
          res.status(500);
          res.statusMessage = "Error during saving sked";
          res.setHeader("statusMessage", "Error during saving sked");
          return res.send();
        }
        res.status(200);
        res.statusMessage = "OK";
        res.setHeader("statusMessage", "OK");
        return res.send();
      });
    } else {
      Sked.updateOne({from: req.body.from, to: req.body.to}, {$set: {data: skedState}} , function(err, result) {
        if(err) {
          res.status(500);
          res.statusMessage = "Error during updating sked";
          res.setHeader("statusMessage", "Error during updating sked");
          return res.send();
        }
        res.status(200);
        res.statusMesssage = "OK";
        res.setHeader("statusMessage", "OK");
        return res.send();
      });
    }
  }); 
});

// GET /auth
router.get("/auth", mid.notAuthorised, function(req, res, next) {
  return res.render("auth", {title: "Авторизация"} )
});

// POST /auth
router.post("/auth", mid.notAuthorised, function(req, res, next) {
  if(!req.body.login || !req.body.pass) {
    res.statusMessage = "Login or password is absent";
    res.setHeader("statusMessage", "Login or password is absent");
    return res.send();
  }
  User.authorize(req.body.login, req.body.pass, function(err, user) {
    if(err || !user) {
      res.status(500);
      res.statusMessage = "Check login and password";
      res.setHeader("statusMessage", "Check login and password");
      return res.send();
    }
    Admin.findOne({userId: user._id}, function(err, adminFound) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during searching user data";
        res.setHeader("statusMessage", "Error during searching user data");
        return res.send();
      } 
      if(adminFound && adminFound != null) {
        req.session.admin = true;
      }
      req.session.userId = user._id;
      req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 3600000);

      res.status(200);
      res.statusMessage = "Authorised";
      res.setHeader("statusMessage", "Authorised");
      return res.send();
    });
  });
});

// get /out
router.get("/out", mid.authorised, function(req, res, next) {
  if(req.session) {
    //delete session
    req.session.destroy(function(err) {
      if(err) {
        let error = new Error("Error during destroying session");
        return next(error);
      }
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

// GET /authenticate
router.get("/authenticate", mid.notAuthorised, function(req, res, next) {
  return res.render("authenticate", {title: "Аутентификация"});
});

// POST /authenticate
router.post("/authenticate", mid.notAuthorised, function(req, res, next) {
  if(!req.body.login || !req.body.pass1 || !req.body.pass2) {
    res.status(500);
    res.statusMessage = "Inconsistent data";
    res.setHeader("statusMessage", "Inconsistent data");
    return res.send();
  } else if(req.body.pass1 !== req.body.pass2) {
    res.status(500);
    res.statusMessage = "Passwords mismatch";
    res.setHeader("statusMessage", "Passwords mismatch");
    return res.send();
  }
  User.registerNew({username: req.body.login, pass: req.body.pass1}, function(err, user) {
    if(err || !user) {
      if (err.code == 11000) {
        res.status(500);
        res.statusMessage = "Duplicate";
        res.setHeader("statusMessage", "Duplicate");
        return res.send();
      }
      res.status(500);
      res.statusMessage = "Error during authenticating";
      res.setHeader("statusMessage", "Error during authenticating");
      return res.send();
    } 
    res.status(200);
    res.statusMessage = "Authenticated";
    res.setHeader("statusMessage", "Authenticated");
    return res.send();
  });
});

// GET /about
router.get("/about", function(req, res, next) {
  return res.render("about", {title: "О Rocky"});
});


module.exports = router;