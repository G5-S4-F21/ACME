'use.strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
let express = require('express');
//let mongoose = require('mongoose');
let MongoClient = require('mongodb').MongoClient;
let db = require('../config/db');
let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;
const Util_1 = require('../Utils/index');
let indexController = require("../controllers/indexController");
const trainerExists = require("../Utils/checkIfTrainerUserNameExist");
const auditorExists = require("../Utils/checkIfAuditorUserNameExist");
let ApptModel = require('../models/appointment');
let Appt = ApptModel.Appointment;

const tennisTrainerSeeker = __importDefault(require("../models/tennisTrainerSeeker"));
const q_1 = __importDefault(require("q"));
const rateIndex_1 = require("../Utils/rateIndex");

const tennisTrainer_1 = __importDefault(require("../models/tennisTrainer"));
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

async function ProcessRegisterSeekerPage(req, res, next) {
    let newUser = new tennisTrainerSeeker.default({
        userType: "seeker",
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    //Check if the user already exist
    
    
    (0, trainerExists.checkIfTrainerNameIsTaken)(req).then(result =>{ 
        console.log(result);

        if(result === "true")
        {
            req.flash('registerMessage', 'Registration Error - user exists');
            return res.redirect('/seeker/registerSeeker');
        }
        else
        {
            (0, auditorExists.checkIfAuditorNameIsTaken)(req).then(result =>{ 
                console.log(result);
        
                if(result === "true")
                {
                    req.flash('registerMessage', 'Registration Error - user exists');
                    return res.redirect('/seeker/registerSeeker');
                }
                else
                {
                    tennisTrainerSeeker.default.register(newUser, req.body.password, (err) => {
                        if (err) {
                            console.error('Error: Inserting New User');
                            if (err.name == "UserExistsError") {
                                req.flash('registerMessage', 'Registration Error');
                            }
                            console.log(err);
                            console.log('Error: User Already Exists');
                            return res.redirect('/seeker/registerSeeker');
                        }
                        return passport.authenticate('seekerLocal')(req, res, () => {
                            return res.redirect('/seeker/displaySeekerHome');
                        });
                    });   
                   
                }
                    
            
           
            }) 
           
        }
            
    
   
    })
    
    
    
}
exports.ProcessRegisterSeekerPage = ProcessRegisterSeekerPage;

function DisplaySeekerHome(req, res, next) {
    res.render('seekerViews/seekerIndex', { title: 'Seeker Home Page', page: 'seekerHome', displayName: (0, Util_1.UserDisplayName)(req) });
}
exports.DisplaySeekerHome = DisplaySeekerHome;
function DisplaySeekerSearch(req, res, next) {
    res.render('seekerViews/seekerIndex', { title: 'Seeker Search Page', page: 'seekerSearch', displayName: (0, Util_1.UserDisplayName)(req) });
}
exports.DisplaySeekerSearch = DisplaySeekerSearch;
function ProcessSeekerSearchPage(req, res, next) {
    var deferred = q_1.default.defer();
    let province = req.body.province;
    let city = req.body.city;
    let minAmount = 0;
    let maxAmount = 51;
    if (province && !city) {
        if ((0, rateIndex_1.rateIndex)(req) === "1") {
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "2") {
            minAmount = 50;
            maxAmount = 101;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "3") {
            minAmount = 100;
            maxAmount = 201;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "4") {
            minAmount = 200;
            maxAmount = 301;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "5") {
            minAmount = 300;
            maxAmount = 401;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "6") {
            minAmount = 399;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
    }
    else if (province && city) {
        if ((0, rateIndex_1.rateIndex)(req) === "1") {
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "2") {
            minAmount = 50;
            maxAmount = 101;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "3") {
            minAmount = 100;
            maxAmount = 201;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "4") {
            minAmount = 200;
            maxAmount = 301;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "5") {
            minAmount = 300;
            maxAmount = 401;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "6") {
            minAmount = 399;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req)})
                    });
                }
            });
        }
    }
    else {
        if ((0, rateIndex_1.rateIndex)(req) === "1") {
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "2") {
            minAmount = 50;
            maxAmount = 101;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "3") {
            minAmount = 100;
            maxAmount = 201;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "4") {
            minAmount = 200;
            maxAmount = 301;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "5") {
            minAmount = 300;
            maxAmount = 401;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "6") {
            minAmount = 399;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
    }
}
exports.ProcessSeekerSearchPage = ProcessSeekerSearchPage;

function DisplayTrainerHome(req, res, next) {
    var deferred = q_1.default.defer();
    let trainerName = req.params.username;
    tennisTrainer_1.default.find({
        "username": trainerName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let hourlyRate = " ";
            let aboutMe = " ";
            let emailAddress = " ";
            let displayName = " ";
            let phoneNumber = " ";
            let sex = " ";
            let age = " ";
            let province = " ";
            let city = " ";
            docs.forEach(function fn(doc) {
                hourlyRate = `${doc.hourlyRate}`;
                aboutMe = `${doc.aboutMe}`;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                phoneNumber = `${doc.phoneNumber}`;
                sex = `${doc.sex}`;
                age = `${doc.age}`;
                province = `${doc.province}`;
                city = `${doc.city}`;
            });
            deferred.resolve({
                hourlyRate: hourlyRate,
                aboutMe: aboutMe,
                emailAddress: emailAddress,
                displayName: displayName,
                phoneNumber: phoneNumber,
                sex: sex,
                age: age,
                province: province,
                city: city,
                respond: res.render('seekerViews/seekerIndex', { title: 'Trainer Page', page: 'trainerHome', city: city, province: province, age: age, sex: sex, hourlyRate: hourlyRate, aboutMe: aboutMe, emailAddress: emailAddress, displayNameFromQuery: displayName, phoneNumber: phoneNumber, username: trainerName, displayName: (0, Util_1.UserDisplayName)(req) })
            });
        }
    });
}
exports.DisplayTrainerHome = DisplayTrainerHome;

module.exports.UpdateOrDeleteAccount = (req, res, next) => {
    res.render('seekerViews/seekerIndex', { title: "Update or Delete Account", page: 'updateOrDeleteAccount', displayName: (0, Util_1.UserDisplayName)(req) });
}

function DeleteSeekerAccount(req, res, next) {
    let username = req.user.username;
    tennisTrainerSeeker.default.remove({ username: username }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect('/');
    });
}
exports.DeleteSeekerAccount = DeleteSeekerAccount;

function DisplayUpdatePersonalInformation(req, res, next) {
    res.render('seekerViews/seekerIndex', { title: 'Update your personal information', page: 'updatePersonalInformation',  user: req.user, displayName: (0, Util_1.UserDisplayName)(req) })
                         
}
exports.DisplayUpdatePersonalInformation = DisplayUpdatePersonalInformation;

function ProcessUpdatePersonalInformation(req, res, next) {
    let user = req.user;
    user.displayName = req.body.displayName;
    user.emailAddress = req.body.emailAddress;
    user.save();
    let seekerRoute = '/seeker/displaySeekerHome/';
    return res.redirect(seekerRoute);
}
exports.ProcessUpdatePersonalInformation = ProcessUpdatePersonalInformation;