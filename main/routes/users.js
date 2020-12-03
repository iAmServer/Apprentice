var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
var User = require("../models/users");
var Training = require("../models/training");
var Res = require("../models/res");
var Trans = require("../models/trans");
var Skill = require("../models/skills");
var Track = require("../models/track");
const unirest = require("unirest");
const LocalStrategy = require("passport-local").Strategy;

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users");
  }
  next();
}

function addDate() {
  var date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date;
}

function cDate(dat) {
  var date = new Date(dat).toDateString();
  return date;
}

passport.use(
  "local",
  new LocalStrategy({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({
          email: email
        },
        function (err, user) {
          if (err) return done(err);

          if (!user)
            return done(null, false, {
              message: "Please check email and try again"
            });

          if (!bcrypt.compare(password, user.password))
            return done(null, false, {
              message: "Password incorrect"
            });

          return done(null, user);
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, {
    user
  });
});

// ROUTE STARTS
router.get("/", checkAuthenticated, function (req, res, next) {
  res.redirect("/users/training");
});

router.get("/loggedin", function (req, res, next) {
  if (req.isAuthenticated()) {
    res.json({
      msg: true
    });
  } else {
    res.json({
      msg: false
    });
  }
});

router.post("/paymentverification", checkAuthenticated, function (
  req,
  res,
  next
) {
  var server_url =
    "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify";
  var payload = {
    SECKEY: "FLWSECK-aae7e43e22641b8f5b273acbfe185649-X",
    txref: req.body.txtRef
  };

  unirest
    .post(server_url)
    .headers({
      "Content-Type": "application/json"
    })
    .send(payload)
    .end(function (response) {
      if (
        response.body.data.status === "successful" &&
        response.body.data.chargecode == 00
      ) {
        if (response.body.data.amount === req.body.amount) {
          var trans = new Trans({
            user: req.body.user,
            skill: req.body.skill,
            amount: req.body.amount,
            transaction_id: response.body.data.flwref,
            transaction_status: "Successful"
          });
          trans.save(err => {
            if (err) {
              throw err;
            }

            Trans.findOne({
                user: req.body.user
              },
              function (err, doc) {
                if (err) {
                  throw err;
                }
                var training = new Training({
                  user: req.body.user,
                  skill: req.body.skill,
                  payment: doc._id,
                  end_date: addDate()
                });

                training.save(err => {
                  if (err) {
                    throw err;
                  }
                  res.json({
                    success: true
                  });
                });
              }
            );
          });
        }
      }
    });
});

router.get("/training", checkAuthenticated, function (req, res, next) {
  var user = req.user.user;
  Training.findOne({
      user: user
    },
    function (err, doc) {
      if (err) {
        throw err;
      }
      if (doc == null) {
        res.render("main", {
          title: "Training - Kósé",
          user: req.user.user
        });
      } else {
        Skill.findOne({
            _id: doc.skill
          },
          function (err, resp) {
            if (err) {
              throw err;
            }
            Res.find({
                skill: doc.skill
              },
              function (err, ress) {
                if (err) {
                  throw err;
                }
                console.log(resp);
                let data = {
                  train: doc,
                  date: cDate(doc.start_date),
                  skill: resp,
                  resources: ress
                };
                res.render("main", {
                  title: "Training - Kósé",
                  data: data,
                  user: req.user.user
                });
              }
            );
          }
        );
      }
    }
  );
});

router.get("/skill/:id", checkAuthenticated, function (req, res, next) {
  let id = req.params.id;
  let user = req.user.user;

  Training.findOne({
      user: user
    },
    function (err, d) {
      if (err) {
        throw err;
      }
      if (d == null || d.active == false) {
        Skill.findOne({
            _id: id
          },
          function (err, doc) {
            if (err) {
              throw err;
            }
            let skill = doc;
            Res.find({
                skill: skill._id
              },
              (err, doc) => {
                res.render("start", {
                  skill: skill,
                  resources: doc,
                  title: skill.name + " Skill",
                  user: user
                });
              }
            );
          }
        );
      } else {
        res.redirect("/users/training");
      }
    }
  );
});

router.get("/findSkill", checkAuthenticated, function (req, res, next) {
  Skill.find(function (err, doc) {
    if (err) {
      throw err;
    }
    res.render("findskill", {
      skills: doc,
      title: "Find Skills - Kósé"
    });
  });
});

router.post('/res/done', (req, res, next) => {
  var skill = req.body.skill;
  var res = req.body.res;
  var user = req.user;
  console.log(req.body);

  Track.findOne({
    skill: skill,
    resource: res,
    user: user._id
  }, function (err, doc) {
    if (err) {
      throw err;
    }

    if (doc != null) {
      var track = new Track({
        user: user,
        skill: skill,
        resource: res,
        status: true
      });

      track.save(err => {
        if (err) {
          throw err;
        }


        res.json({
          msg: 'done'
        });
      })
    } else {
      console.log('jhfbvh');
    }
  });
});

router.post('/res/undone', (req, res, next) => {
  var data = req.body;
  console.log(data);
  res.json({
    msg: 'done'
  });
});

router.post("training/add", (req, rees, next) => {
  let user = req.user.user._id;
  let skill = req.skill._id;
  let payment = req.payment._id;
  let train = {
    skill: skill,
    user: user._id,
    payment: payment,
    start_date: new Date().toDateString(),
    end_date: new Date() + 356,
    active: true,
    complete: false
  };

  var trains = new Training(train);
  trains.save(err => {
    if (err) {
      throw err;
    }

    res.redirect("/users/training");
  });
});

router.get("/login", function (req, res, next) {
  res.render("login", {
    title: "Login - Kósé"
  });
});

router.get("/search", (req, res, next) => {
  var q = req.query.q;
  Skill.find({
      name: {
        $regex: new RegExp(q)
      }
    }, {
      _id: 0,
      _v: 0
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      res.json(data);
    }
  ).limit(10);
});

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/users/",
  failureRedirect: "/users/login",
  failureFlash: true
}));

router.get("/register", function (req, res, next) {
  res.render("register", {
    title: "Registration - Kósé"
  });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var users = {
      name: req.body.name,
      username: req.body.email,
      email: req.body.email,
      encryptedPassword: hashedPassword,
      role: "Restricted"
    };
    var user = new User(users);
    user.save(err => {
      if (err) {
        console.log(err);
        return;
      }

      res.redirect("/users/login");
    });
  } catch (email) {
    console.log(email);
    res.redirect("/users/register");
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.logout();
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/users/login");
      }
    });
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;