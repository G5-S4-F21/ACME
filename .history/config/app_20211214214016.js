var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport');
let bodyParser = require('body-parser');
let localStrategy = require('passport-local').Strategy;
let session = require('express-session');
const cors_1 = __importDefault(require("cors"));
const connect_flash_1 = __importDefault(require("connect-flash"));
// database setup
let mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', ()=>{
  console.log('url: localhost:3000');
  console.log('Connected to MongoDB...');
});


let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let seekerRouter = require('../routes/seeker');
let trainerRouter = require('../routes/trainer');
let administratorRouter = require('../routes/administrator');
let auditorRouter = require('../routes/auditor');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use((0, connect_flash_1.default)());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', express.static('public'))
app.use(express.static(path.join(__dirname, '../node_modules')));
app.use((0, cors_1.default)());
app.use(session({
  secret: "somesecret",
  saveUninitialized: true,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/seeker', seekerRouter);
app.use('/trainer', trainerRouter);
app.use('/administrator', administratorRouter);
app.use('/auditor', auditorRouter);
//the passport stuff
let userModel = require('../models/users.js');
let User = userModel.User;
let trainerModel = require('../models/tennisTrainer.js');
let Trainer = trainerModel.UserSchema;
let seekerModel = require('../models/tennisTrainerSeeker.js');
let Seeker = seekerModel.UserSchema;
let auditorModel = require('../models/auditor.js');
let auditor = auditorModel.UserSchema;
let administratorModel = require('../models/administrator.js');
let administrator = administratorModel.UserSchema;
passport.use('trainerLocal',trainerModel.default.createStrategy());
passport.use('seekerLocal',seekerModel.default.createStrategy());
passport.use('auditorLocal',auditorModel.default.createStrategy());
passport.use('administratorLocal',administratorModel.default.createStrategy());

passport.serializeUser(function (userObject, done) {
  
  // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
  let userGroup = "model1";
  let userPrototype =  Object.getPrototypeOf(userObject);

  if (userPrototype === seekerModel.default.prototype) {
    userGroup = "model1";
  } else if (userPrototype === trainerModel.default.prototype) {
    userGroup = "model2";
  }
  else if (userPrototype === auditorModel.default.prototype) {
    userGroup = "model3";
  }
  else if (userPrototype === administratorModel.default.prototype) {
    userGroup = "model4";
  }
  let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
  done(null,sessionConstructor);
});

passport.deserializeUser(function (sessionConstructor, done) {

  if (sessionConstructor.userGroup == 'model1') {
    seekerModel.default.findOne({
        _id: sessionConstructor.userId
    }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
        done(err, user);
    });
  } else if (sessionConstructor.userGroup == 'model2') {
    trainerModel.default.findOne({
        _id: sessionConstructor.userId
    }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
        done(err, user);
    });
  }
  else if (sessionConstructor.userGroup == 'model3') {
    auditorModel.default.findOne({
        _id: sessionConstructor.userId
    }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
        done(err, user);
    });
  }

  else if (sessionConstructor.userGroup == 'model4') {
    administratorModel.default.findOne({
        _id: sessionConstructor.userId
    }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
        done(err, user);
    });
  }

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

module.exports = app;
