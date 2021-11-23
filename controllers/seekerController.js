'use.strict'
let express = require('express');
let mongoose = require('mongoose');
let MongoClient = require('mongodb').MongoClient;
let db = require('../config/db');
//let passport = require('passport'), 
  //  LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;

let indexController = require("../controllers/indexController");

let ApptModel = require('../models/appointment');
let Appt = ApptModel.Appointment;
