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

// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

/**
 * render the schedule page
 * @param req
 * @param res
 * @param next
 */
module.exports.renderScheduleView = (req, res, next) => {
    //cannot view this page without logged in
    if(!req.session.user_email){
        res.redirect('/login')
        return
    }

    // if the trainer does not submit their profile, they cannot book appointment.
    // use years of training as the enter point
    Trainer.findOne({trainerEmail:req.session.user_email}, (err, trainer) => {
        console.log(trainer)
        if(!trainer){
            // no such user
            res.redirect('/register')
        }else{
            // have this user
            // To see whether the user fill the certificate form
            if(trainer.trainerYearsOfTraining.trim()===''){
                // did not fill certificate form
                return res.send('0')
            }else{
                // filled certificate form
                //retreive the list of appts and send to the client
                // TODO: render trainer schedule view
                Appt.find({},(err, mainList) => {
                    if(err) {
                        return console.error(err);
                    }
                    else {

                        console.log('schedule')
                        res.render('trainerViews/viewSchedule', { title : "My schedule",
                            list : mainList });
                    }
                });
            }
        }
    })



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
            console.log('error setting appt');
            res.render('seekerViews/viewSchedule', { title: 'Schedule'});
        }
    });
    res.render('trainerViews/viewSchedule', { title: 'Schedule'});
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


/**
 * render trainer certificate form view
 */
module.exports.renderCertificateView=(req,res,next)=>{
    // find this trainer first
    Trainer.findOne({trainerEmail:req.session.user_email}, (err, trainer)=>{
        if(err){
            return res.send('-2')
        }
        if(!trainer){
            return res.send('0')
        }else if(trainer){
            const userInfo={
                user_email:req.session.user_email,
                user_password:req.session.user_password,
                user_account_type:req.session.user_account_type
            }
            return res.render('trainerViews/trainerCertificateFormView',{
                title:'Trainer Certificate',
                userInfo
            })
        }
    })
}

/**
 * store trainer certificate
 */
module.exports.trainerFillCertificate=(req,res,next)=>{
    const {trainer_full_name, trainer_years_of_training}=req.body
    Trainer.findOneAndUpdate({trainerEmail: req.session.user_email}, {
        $set:{
            trainerName:trainer_full_name,
            trainerYearsOfTraining:trainer_years_of_training
        }
    }, {},(err, trainer) => {
        if(err){
            // -2: server error
            return res.send('-2')
        }
        if(!trainer){
            // 0: no such user
            return res.send('0')
        }else{
            // reset password
            console.log('updated!')
            return res.send('1')
        }
    })
}
