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

// GET /materials/lower-doors-lock
router.get("/lower-doors-lock", function(req, res, next) {
  return res.render("materials/lower-doors", {title: "Блокировка дверей трюма"});
});


module.exports = router;