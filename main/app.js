var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("express-flash");
var passport = require("passport");
mongoose.Promise = global.Promise;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var esession = require('express-session');

mongoose
  .connect("mongodb://localhost:27017/appren", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {})
  .catch(error => {
    console.log(error);
  });

var app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(esession({
  secret: 'iAmServeNetwork',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;