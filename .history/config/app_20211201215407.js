"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
//let passport = require('passport');
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
let localStrategy = passport_local_1.default.Strategy;
let bodyParser = require('body-parser');
//let localStrategy = require('passport-local').Strategy;
let session = require('express-session');
const cors_1 = __importDefault(require("cors"));
const connect_flash_1 = __importDefault(require("connect-flash"));
// database setup
const mongoose = __importDefault(require("mongoose"));
let DB = require('./db');
mongoose.default.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.default.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', ()=>{
  console.log('url: localhost:3000');
  console.log('Connected to MongoDB...');
});


let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let seekerRouter = require('../routes/seeker');
let trainerRouter = require('../routes/trainer');

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

//app.use(passport.initialize());
//app.use(passport.session());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/seeker', seekerRouter);
app.use('/trainer', trainerRouter);

//the passport stuff
let userModel = require('../models/users.js');
let User = userModel.User;
let trainerModel = require('../models/tennisTrainer.js');
let Trainer = trainerModel;
const tennisTrainerSeeker_1 = __importDefault(require("../models/tennisTrainerSeeker"));
const tennisTrainer_1 = __importDefault(require("../models/tennisTrainer"));
passport_1.default.use(tennisTrainer_1.default.createStrategy());
passport_1.default.serializeUser(tennisTrainerSeeker_1.default.serializeUser(),tennisTrainer_1.default.serializeUser());
passport_1.default.deserializeUser(tennisTrainerSeeker_1.default.deserializeUser(),tennisTrainer_1.default.serializeUser());
//passport.use(User.createStrategy(), trainerModel.default.createStrategy());
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());







//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));



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

module.exports = app;
