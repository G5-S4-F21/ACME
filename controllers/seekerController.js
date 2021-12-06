'use.strict'
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let fs = require('fs');
const PDFDocument = require('pdfkit');
let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;
// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

let SeekerModel = require('../models/Trainer_seeker');
let Seeker = SeekerModel.Trainer_seeker;

//let indexController = require("../controllers/indexController");

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
            if(alphaN == null)
            {
                if(alphaE == null)
                {
                    if(exp == null)
                    {
                        res.render('seekerViews/seekerTrainerSearch', { title : 'Search', userInfo : userInfo, 'list' : tList });
                    }
                }
            }
            for(let a of tList)
            {
                try
                {
                    if(a.trainerName.includes(alphaN))
                    {
                        retList.push(a);
                    }
                    if(a.trainerEmail.includes(alphaEmail))
                    {
                        retList.push(a);
                    }
                    if(a.trainerYearsOfTraining.includes(expYears))
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

module.exports.setFavorite = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    //logic to add trainer to favorites
    console.log(req.body.trainerId);
    res.redirect('/search');
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
  //let localUser = req.user;
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

//performs the download
module.exports.downloadSchedule = (req, res, next) => {
    //still required is the move to the schedule data
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('pdfs/pdf1.pdf'));
    doc.pipe(res);

    doc.text('helloworld')
    
    doc.end();
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
    console.log(req.body.reason);
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
    if(req.body.apptTrainer == null)
    {
        res.redirect('schedule');
    }
    if(req.body.apptSeek == null)
    {
        res.redirect('schedule');
    }
    if(req.body.apptDate == null)
    {
        res.redirect('schedule');
    }
    if(req.body.apptTime == null)
    {
        res.redirect('schedule');
    }
    if(req.body.apptLoc == null)
    {
        res.redirect('schedule');
    }
    let newAppt = Appt({
        'ApptDate' : req.body.apptDate,
        'ApptTrainer' : req.body.apptTrainer,
        'ApptSeeker' : req.body.apptSeek,
        'ApptLoc' : req.body.apptLoc,
        'ApptTime' : req.body.apptTime
    });
    //console.log(newAppt);
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

module.exports.renderAccountChoices =(req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    res.render('seekerViews/seekerAccountChoice', { title : 'Accounts', userInfo: userInfo });
}
//the individual pages
module.exports.renderAccountPage = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    //find the account associated with this seeker
    Seeker.find((err, seekerlist) => {
        if(err)
        {
            console.log(err);
            //res.render('seekerViews/seekerUpdatePrivate', { title : 'Account', userInfo });
        }
        else
        {
            for(a of seekerlist)
            {
                if(a.trainer_seeker_email == userInfo.user_email)
                {
                    res.render('seekerViews/seekerUpdatePrivate', { title : 'Account', userInfo, AccountDetails : a });
                }
            }
            let temp = SeekerModel.Trainer_seeker({

            });
            res.render('seekerViews/seekerUpdatePrivate', { title : 'Account', userInfo, AccountDetails : temp });
        }
    });

    //res.render('seekerViews/seekerUpdatePrivate', { title : 'Account', userInfo });
}

module.exports.renderPublicPage = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    
    //should be profile
    let user;
    Seeker.find((err, seekerlist) => {
        if(err)
        {
            console.log(err);
            res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo });
        }
        else
        {
            for(a of seekerlist)
            {
                if(a.trainer_seeker_email == userInfo.user_email)
                {
                    //res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, AccountDetails : a });
                    user = a;
                    
                    //let temp = Profile({});
                    //res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, user : a, profile : temp });
                }
            }
            
            try
            {
                Profile.findOne({UUIDid : user._id }, toGo, (err) => {
                    //Profile.findOne({ name: 'seeker' })
                    if(err)
                    {
                        let temp = Profile({});
                        res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, profile : temp, user });
                    }
                    else
                    {
                        if(toGo == null)
                        {
                            let temp = Profile({});
                            res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, profile : temp, user });
                        }
                        res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, profile : toGo, user });
                    }
                });
            }
            catch
            {
                let user = Seeker({});
                let temp = Profile({});
                res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, profile : temp, user });
            }
        }
    });
    //find the account associated with this seeker
    //res.render('seekerViews/seekerUpdatePublic', { title : 'Profile', userInfo, user});
}
//the updates for the accounts
module.exports.updateSecret = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    console.log('update secret')
    //find and update the seeker
    let id = req.body.id;
    let uuid = req.body.uuid;
    let toUpdate = Seeker({
        "_id": id,
        "trainer_seeker_email": req.body.apptEmail,
        "trainer_seeker_password": req.body.apptPassword,
        "trainer_seeker_cellphone": req.body.apptCell,
        "trainer_seeker_name" : req.body.apptName,
        "UUID": uuid
    });
    console.log(toUpdate);
    try
    {
        Seeker.updateOne({_id : id}, toUpdate, (err) => {
            if(err)
            {
                console.log(err);
                res.end(err);
            }
            else
            {
            
            }
        });
    }
    catch{}
    res.render('seekerViews/seekerAccountChoice', { title : 'Accounts', userInfo: userInfo });
}

module.exports.updateProfile = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    let id = req.body.id;
    //let uuid = req.body.uuid;
    let toUpdate = Profile({
        'username' : userInfo.user_email,
        'greeting' : req.body.apptGreet,
        'skill' : req.body.apptSkill,
        'athletic' : req.body.apptAthletic,
        'slogan' : req.body.apptSlogan,
        'favFood' : req.body.apptFood,
        'favTennisPlayer' : req.body.apptPlayer,
        'favMovie' : req.body.apptMovie
    });
    try
    {
        Profile.findOne({ _id : id }, retVal, (err) => {
            if(err)
            {
                console.log('problem with profile');
            }
            else
            {
                toUpdate.save((err, Appt) => {
                    if(err)
                    {
                        //try to add in ajax here
                        res.render('seekerViews/seekerAccountChoice', { title : 'Accounts', userInfo: userInfo });
                    }
                    res.render('seekerViews/seekerAccountChoice', { title : 'Accounts', userInfo: userInfo });
                }); 
            }
        });
    }
    catch
    {
        res.render('seekerViews/seekerAccountChoice', { title : 'Accounts', userInfo: userInfo });
    }
    try
    {
        Profile.updateOne({_id : id}, toUpdate, (err) => {
            if(err)
            {
                console.log(err);
                res.end(err);
            }
            else
            {
                console.log('it should have worked');
            }
        });
    }
    catch{}
    res.render('seekerViews/seekerAccountChoice', { title : 'Accounts', userInfo: userInfo });
}