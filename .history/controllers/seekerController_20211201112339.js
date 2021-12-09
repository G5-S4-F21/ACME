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
const Util_1 = require('../Utils/index');
let indexController = require("../controllers/indexController");

let ApptModel = require('../models/appointment');
let Appt = ApptModel.Appointment;

const tennisTrainerSeeker = __importDefault(require("../models/tennisTrainerSeeker"));

//render the schedule page for the seeker
module.exports.renderSeekerSchedule = (req, res, next) => {
  let localUser = req.user;
  Appt.find((err, mainList) => {
      if(err) {
          return console.error(err);
      }
      else {
          /*let list = [];
          for(let a in mainList)
          {
              if(localUser.username == mainList[a].ApptSeeker)
              {
                  list.push(mainList[a]);
                  
              }
              //console.log(mainList[a]);
          }
          let toSend = JSON.stringify(list);
          console.log(toSend);*/
          res.render('seekerViews/seekerScheduleView', { title : "Schedule", 
              list : mainList });
      }
  });
  //res.render('seekerViews/seekerScheduleView', { title: "Schedule", list : mainList });
}
//handle the request for the detailed view of the schedule
module.exports.renderDetailedView = (req, res, next) => {
  let apptDate = req.body.dateLookup;
  console.log(apptDate);
  Appt.findById(apptDate, (err, date) => {
      if(err)
      {
          console.log(err);
      }
      else{
          console.log(date);
          res.render('seekerViews/detailedApptView', { title : 'details', appt : date });        
      }
  });
}

function DisplayRegisterSeekerPage(req, res, next) {
    if (!req.user) {
        return res.render('seekerViews/seekerIndex', { title: 'Seeker registration', page: 'registerSeeker', messages: req.flash('registerMessage'), displayName: (0, Util_1.UserDisplayName)(req) });
    }
    
    return res.redirect('/tennis');
}
exports.DisplayRegisterSeekerPage = DisplayRegisterSeekerPage;

function ProcessRegisterSeekerPage(req, res, next) {
    let newUser = new tennisTrainerSeeker_1.default({
        userType: "seeker",
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    tennisTrainerSeeker_1.default.register(newUser, req.body.password, (err) => {
        if (err) {
            console.error('Error: Inserting New User');
            if (err.name == "UserExistsError") {
                req.flash('registerMessage', 'Registration Error');
            }
            console.log('Error: User Already Exists');
            return res.redirect('/registerSeeker');
        }
        return passport_1.default.authenticate('local')(req, res, () => {
            return res.redirect('/home');
        });
    });
}
exports.ProcessRegisterSeekerPage = ProcessRegisterSeekerPage;