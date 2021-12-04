'use.strict'
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;
// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

let indexController = require("../controllers/indexController");

let Appt = require('../models/appointment');




module.exports.renderSeekerSearch = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    let tlist = [];
    res.render('seekerViews/seekerTrainerSearch', { title : 'Search', userInfo : userInfo, 'list' : tlist });
}

module.exports.performSearch = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    let alphaN = req.body.alphaName;
    let alphaE = req.body.alphaEmail;
    let exp = req.body.expYears;
    let retList;
    Trainer.find((err, tList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //this part is not correct
            for(let a of tList)
            {
                try
                {
                    if(a.trainerName.contains(alphaN))
                    {
                        retList.push(a);
                    }
                    if(a.trainerEmail.contains(alphaEmail))
                    {
                        retList.push(a);
                    }
                    if(a.trainerYearsOfTraining.contains(expYears))
                    {
                        retList.push(a);
                    }
                }
                catch
                {

                }
            }
        }
        res.render('seekerViews/seekerTrainerSearch', { title : 'Search', userInfo : userInfo, 'list' : tList });
    });
}

module.exports.renderFavorites = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    };

    res.render('seekerViews/seekerFavView', { title : 'Favorites', userInfo : userInfo });
}
//render the schedule page for the seeker
module.exports.renderSeekerSchedule = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    console.log(req.body);
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
              list : mainList, 
              userInfo : userInfo, email: userInfo.user_email });
      }
  });
  //res.render('seekerViews/seekerScheduleView', { title: "Schedule", list : mainList });
}
//handle the request for the detailed view of the schedule
module.exports.renderDetailedView = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
  let apptDate = req.body.dateLookup;
  console.log(apptDate);
  Appt.findById(apptDate, (err, date) => {
      if(err)
      {
          console.log(err);
      }
      else{
          console.log(date);
          res.render('seekerViews/detailedApptView', { title : 'details', appt : date, userInfo : userInfo });        
      }
  });
}
//handles the confirm for the detailed view
//this is really just a put to the appt
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

module.exports.confirmDelete = (req, res, next) => {
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
module.exports.setAppt = (req, res, next) => {
    let newAppt = Appt({
        'ApptDate' : req.body.apptDate,
        'ApptTrainer' : req.body.apptTrainer,
        'ApptSeeker' : req.body.apptSeek,
        'ApptLoc' : req.body.apptLoc,
        'ApptTime' : req.body.apptTime
    });
    console.log(newAppt);
    //store the data in the db
    newAppt.save((err, Appt) => {
        if(err)
        {
            //try to add in ajax here
            res.render('schedule')
        }
        res.redirect('schedule');
    });   
}