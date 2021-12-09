'use.strict'
const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
let url = require('url');

let UserModel = require('../models/users');
let User = UserModel.User;

let ApptModel = require('../models/appointment');
let Appt = ApptModel.Appointment;

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
            res.redirect('/schedule');
        }
    });
    //res.render('trainerViews/viewSchedule', { title: 'Schedule'});
    res.redirect('/schedule');
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