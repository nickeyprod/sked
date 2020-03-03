const express = require('express'),
      router = express.Router();


// GET /materials
router.get("/", function(req, res, next) {
  return res.render("materials/materials", {title: "Материалы"});
});

// GET /materials/prompt-box
router.get("/prompt-box", function(req, res, next) {
  return res.render("materials/prompt-box", {title: "Суфлёрская будка"});
});

// GET /materials/german-notations
router.get("/german-notations", function(req, res, next) {
  return res.render("materials/german-notations", {title: "Немецкие обозначения"});
});

// GET /materials/prv-schema
router.get("/prv-schema", function(req, res, next) {
  return res.render("materials/prv-schema", {title: "Расположение ПРВ"});
});


module.exports = router;