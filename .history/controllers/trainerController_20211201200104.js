'use.strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//let passport = require('passport'), 
//LocalStrategy = require('passport-local').Strategy;
let url = require('url');
let UserModel = require('../models/users');
let User = UserModel.User;
const trainer_1 = require('../Utils/trainer');
let ApptModel = require('../models/appointment');
let Appt = ApptModel.Appointment;

//const passport_1 = __importDefault(require("passport"));
//const mongoose = __importDefault(require("mongoose"));
let trainerController = require("../controllers/trainerController");
const multer_1 = __importDefault(require("multer"));
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
//const db = mongoose.default.connection;

const tennisTrainer_1 = __importDefault(require("../models/tennisTrainer"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});


//render the schedule page
module.exports.renderSchedule = (req, res, next) => {
    //retreive the list of appts and send to the client
    Appt.find((err, mainList) => {
        if(err) {
            return console.error(err);
        }
        else {
            res.render('trainerViews/viewSchedule', { title : "Schedule", 
                list : mainList });
        }
    });
}
module.exports.renderSetAppt = (req, res, next) => {
    //find the user and check that there data
    let localAppt = new Appt({
        ApptTrainer : req.body.apptTrainer,
        ApptSeeker : req.body.apptSeek,
        ApptDate : req.body.apptDate,
        ApptLoc : req.body.apptLoc,
        ApptTime : req.body.apptTime
    });
    localAppt.save(function (err) {
        if(err) 
        {
            let mainList = req.body.list;
            console.log('error setting appt');
            //res.render('seekerViews/viewSchedule', { title: 'Schedule', list: mainList});
            res.redirect('schedule');
        }
    });
    //res.render('trainerViews/viewSchedule', { title: 'Schedule'});
    res.redirect('schedule');
}
module.exports.renderDetailedView = (req, res, next) => {
    let apptDate = req.body.dateLookup;
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

    
    //res.render('trainerViews/trainerDetailedAppt', { appt : })
}

function DisplayRegisterTrainerPage(req, res, next) {
    if (!req.user) {
        return res.render('trainerViews/trainerIndex', { title: 'Register Trainer', page: 'registerTrainer', messages: req.flash('registerMessage'), displayName: (0, trainer_1.TrainerDisplayName)(req) });
    }
    return res.redirect('/tennis');
}
exports.DisplayRegisterTrainerPage = DisplayRegisterTrainerPage;

function ProcessRegisterTrainerPage(req, res, next) 
{
    
    let ageCalculation = (0, moment_1.default)().diff(req.body.birthDate, 'years');
    let newUser2 = new tennisTrainer_1.default({
        hourlyRate: req.body.hourlyRate,
        aboutMe: req.body.aboutMe,
        
        userType: "trainer",
        username: req.body.username,
        anyGender: "Any gender",
        emailAddress: req.body.emailAddress,
        age: ageCalculation,
        phoneNumber: req.body.phoneNumber,
        sex: req.body.sex,
        birthDate: req.body.birthDate,
        province: req.body.province,
        city: req.body.city,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    tennisTrainer_1.default.register(newUser2, req.body.password, (err) => {
        
        if (err) {
            
            console.error('Error: Inserting New User');
            if (err.name == "UserExistsError") {
                req.flash('registerMessage', 'Registration Error');
            }
            console.log(err);
            console.log('Error: User Already Exists');
            return res.json("not successful");

        }
        return passport_1.default.authenticate('local')(req, res, () => {
            
            //return res.redirect('/home');
            return res.json("successful");
        });
        
    });
}
exports.ProcessRegisterTrainerPage = ProcessRegisterTrainerPage;