'use.strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const passport = require('passport'); 
LocalStrategy = require('passport-local').Strategy;
let url = require('url');
let UserModel = require('../models/users');
let User = UserModel.User;
const trainer_1 = require('../Utils/trainer');
let ApptModel = require('../models/appointment');
let Appt = ApptModel.Appointment;
let trainerController = require("../controllers/trainerController");
const multer_1 = __importDefault(require("multer"));
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const db = mongoose.connection;
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)


const tennisTrainer_1 = require("../models/tennisTrainer");



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
    const file = req.file;
    var img = fs_1.default.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64'),
        certificate: file.filename
    };
    db.collection('certificates').insertOne(finalImg, (err, result) => {
        console.log(result);
        if (err)
            return console.log(err);
            
        console.log('saved to database');
    });
     // Delete the file like normal
     unlinkAsync(req.file.path);
    let ageCalculation = (0, moment_1.default)().diff(req.body.birthDate, 'years');
    let newUser2 = new tennisTrainer_1.default({
        hourlyRate: req.body.hourlyRate,
        aboutMe: req.body.aboutMe,
        certificate: file.filename,
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
        return passport.authenticate('trainerLocal')(req, res, () => {
            
            //return res.redirect('/home');
            return res.json("successful");
        });
        
    });
}
exports.ProcessRegisterTrainerPage = ProcessRegisterTrainerPage;