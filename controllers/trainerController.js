'use.strict'
const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//let passport = require('passport'),
//LocalStrategy = require('passport-local').Strategy;
let url = require('url');

let UserModel = require('../models/users');
let User = UserModel.User;

let Appt = require('../models/appointment');

// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

// original province and city
const province_list=require('../public/resource/province')

/**
 * render the schedule page
 * @param req
 * @param res
 * @param next
 */
module.exports.renderScheduleView = (req, res, next) => {
    //cannot view this page without logged in
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    //console.log("the trainer schedule view controller");
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
                console.log('show schedule')
                return res.send('1')
                // Appt.find({},(err, mainList) => {
                //     console.log('hello')
                //     if(err) {
                //         return console.error(err);
                //     }
                //     else {
                //         res.render('trainerViews/viewSchedule', { title : "My Schedule",
                //             list : mainList, userInfo : userInfo });
                //     }
                // });
            }
        }
    })
}

/**
 * render the schedule page
 * @param req
 * @param res
 * @param next
 */
module.exports.doRenderScheduleView = (req, res, next) => {
    //cannot view this page without logged in
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    //console.log("the trainer schedule view controller");
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

                console.log('show schedule')
                Appt.find({},(err, mainList) => {
                    console.log('hello')
                    if(err) {
                        return console.error(err);
                    }
                    else {
                        res.render('trainerViews/viewSchedule', { title : "My Schedule",
                            list : mainList, userInfo : userInfo });
                    }
                });
            }
        }
    })
}



module.exports.renderSetAppt = (req, res, next) => {
    console.log('hh')
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
//will show the detaile view of the trainer appt
module.exports.renderDetailedView = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    let apptDate = req.body.dateLookup;
    Appt.findById(apptDate, (err, date) => {
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(date);
            res.render('trainerViews/trainerDetailedAppt', { title : 'details', appt : date, userInfo : userInfo });
        }
    });
}

module.exports.confirmAppt = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    let newAppt = Appt({
        '_id' : req.body.confId,
        'ApptDate' : req.body.confDate,
        'ApptTrainer' : req.body.confTrain,
        'ApptSeeker' : req.body.confSeek,
        'ApptLoc' : req.body.confLoc,
        'ApptTime' : req.body.confTime,
        'Confirmed' : true
    });
    Appt.updateOne({_id : newAppt._id } , newAppt, (err) => {
        if(err)
        {
            console.log(err);
            res.redirect('schedule');
        }
        else
        {
            res.redirect('schedule');
        }
    });
}

module.exports.deleteAppt = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    Appt.remove({_id : req.body.confId }, (err) => {
        if(err)
        {
            console.log(err);
            res.redirect('schedule');
        }
        else
        {
            res.redirect('schedule');
        }
    });

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
                userInfo,
                province_list
            })
        }
    })
}

/**
 * store trainer certificate
 */
module.exports.trainerFillCertificate=(req,res,next)=>{
    const {trainer_full_name, trainer_years_of_training, trainer_province, trainer_city}=req.body
    Trainer.findOneAndUpdate({trainerEmail: req.session.user_email}, {
        $set:{
            trainerName:trainer_full_name,
            trainerYearsOfTraining:trainer_years_of_training,
            trainerProvince:trainer_province,
            trainerCity:trainer_city
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
