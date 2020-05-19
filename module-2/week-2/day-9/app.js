require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const app = express();

// connection db
require("./config/mongo");

// config logger (pour debug)
app.use(logger("dev"));

// config point d'entrée data
app.use(express.urlencoded({ extended: false })); // data postée en mode synchrone sous req.body
app.use(express.json()); // data postée en mode asynchrone (AJAX) sous req.body
app.use(cookieParser()); // met à disposition les cookies sous un objet req.cookie

// config des views
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// view engine setup 
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");

// config des routers
app.use(require("./routes/index"));
// app.use(require("./routes/dashboard"));
app.use(require("./routes/products"));
app.use(require("./routes/auth"));
app.use(require("./routes/users"));

// la fonction suivante devra TOUJOURS être déclarée après les routers
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