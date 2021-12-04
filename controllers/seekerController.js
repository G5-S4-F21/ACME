'use.strict'
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;

let indexController = require("../controllers/indexController");

let Appt = require('../models/appointment');



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