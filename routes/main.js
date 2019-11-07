const express = require('express'),
      router = express.Router(),
      Dates = require("calendar-dates"),
      cDates = new Dates(),
      mid = require("../middleware/middleware"),
      Sked = require("../models/sked"),
      User = require("../models/user"),
      Admin = require("../models/admin"),
      Performance = require("../models/performance");

// GET /
router.get("/", function(req, res, next) {
  return res.render("main", {title: "Главная"});
});

// GET /performances
router.get("/performances", function(req, res, next) {
  Performance.aggregate([{$group: {_id: "$type", count: {$sum: 1}}}])
  .exec(function(err, perfNums) {
    if(err) {
      var error = new Error("Error counting performances");
      return next(error);
    }

    let perfsNum = {opera: perfNums[0].count, ballet: perfNums[1].count};

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
router.post("/performances", function(req, res, next) {

  const name = req.body.name;
  const type = req.body.type;
  const imgUrl = req.body.imgUrl;
  const acts = req.body.acts ? req.body.acts.split(",") : null;
  const points = req.body.points ? JSON.parse(req.body.points) : null; 
  const notes = req.body.notes;
  const perfId = req.body.perfId;
  const action = req.body.action;

  if(action !== "remove") {
    if(!name || !type || !acts) {
      res.status(500);
      res.statusMessage = "Incosistent data";
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
          return res.send()
        }
        res.status(200);
        res.statusMessage = "OK";
        return res.send();
      });
  } else if(perfId && action === "remove") {
    Performance.deleteOne({_id: perfId}, function(err, result) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during deleting performance";
        return res.send()
      }
      res.status(200);
      res.statusMessage = "OK";
      return res.send();
    });
  } else {
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
          return res.send();
        }
        res.status(200);
        res.statusMessage = "OK";
        return res.send();
      });
  }
});


// POST /perf-search
router.post("/perf-search", function(req, res, next) {

  if(!req.body.query) {
    res.status(500);
    res.statusMessage = "Bad request, search query absent";
    return res.send();
  }
  let query = new RegExp("^"+req.body.query, "i");

  Performance.aggregate([{$match: {name: {$regex: query}}}]).exec(function(err, perfs) {
    if(err) {
  
      res.status(500);
      res.statusMessage = "Error during perfomance search";
      return res.send();
    }
    res.status(200);
    res.statusMessage = "OK";
    return res.send({perfs: perfs});
  });
});

// GET /sked
router.get("/sked", function(req, res, next) {
   // find sked by date day
   Sked.find({date: 10}, function (err, skeds) {
    if(err) {
      var error = new Error("Error searching sked");
      return next(error);
    }
    console.log(skeds);
    return res.render("sked", {title: "График дежурств"})
  });
});

// POST /sked
router.post("/sked", function(req, res, next) {
  var startDate = new Date(2019, 9);

  var mainAsync = async () => {

    var calendates = await cDates.getDates(startDate);

    return res.render("main", {
      title: "График дежурств", 
      calDates: calendates
    });
  };
  mainAsync();
});


// GET /auth
router.get("/auth", mid.notAuthorised, function(req, res, next) {
  return res.render("auth", {title: "Авторизация"} )
});

// POST /auth
router.post("/auth", mid.notAuthorised, function(req, res, next) {
  if(!req.body.login || !req.body.pass) {
    res.statusMessage = "Login or password is absent";
    return res.send();
  }
  User.authorize(req.body.login, req.body.pass, function(err, user) {
    if(err || !user) {
      res.status(500);
      res.statusMessage = "Check login and password";
      return res.send();
    }
    Admin.findOne({userId: user._id}, function(err, adminFound) {
      if(err) {
        res.status(500);
        res.statusMessage = "Error during searching user data";
        return res.send();
      } 
      if(adminFound && adminFound != null) {
        req.session.admin = true;
      }
      req.session.userId = user._id;
      req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 3600000);

      res.status(200);
      res.statusMessage = "Authorised";
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
    return res.send();
  } else if(req.body.pass1 !== req.body.pass2) {
    res.status(500);
    res.statusMessage = "Passwords mismatch";
    return res.send();
  }
  User.registerNew({username: req.body.login, pass: req.body.pass1}, function(err, user) {
    if(err || !user) {
      res.status(500);
      res.statusMessage = "Error during authenticating";
      return res.send();
    }
    res.status(200);
    res.statusMessage = "Autheticated";
    return res.send();
  });
});


module.exports = router;