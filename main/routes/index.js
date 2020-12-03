var express = require('express');
var router = express.Router();
var passport = require('passport');
var skills = require('../models/skills');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.user;
  skills.find((err, doc) => {
    if(err){
      console.log(err);
    }
    if(user){
      res.render("index", {title: "Welcome to Appren", skills: doc, user: user});
    }else{
      res.render("index", {title: "Welcome to Appren", skills: doc});
    }
  })
});

module.exports = router;
