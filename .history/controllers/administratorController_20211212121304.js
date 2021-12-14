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
const q_1 = __importDefault(require("q"));
let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;
const Util_1 = require('../Utils/administrator.js');
let indexController = require("../controllers/indexController");
const seekerExists = require("../Utils/checkIfSeekerUserNameExist");
const trainerExists = require("../Utils/checkIfTrainerUserNameExist");
const administratorExists = require("../Utils/checkIfAdministratorUserNameExist");
const auditor_1 = __importDefault(require("../models/auditor"));
const administrator_1 = __importDefault(require("../models/administrator"));
const auditorExists = require("../Utils/checkIfAuditorUserNameExist");
const tennisTrainer = __importDefault(require("../models/tennisTrainer"));
const tennisTrainerSeeker = __importDefault(require("../models/tennisTrainerSeeker"));
function DisplayRegisterAuditorPage(req, res, next) {
    
        return res.render('administratorViews/administratorIndex', { title: 'Auditor registration', page: 'registerAuditor', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
    
    
    
}
exports.DisplayRegisterAuditorPage = DisplayRegisterAuditorPage;

function ProcessRegisterAuditorPage(req, res, next) {
    console.log(req.body.emailAddress);
    let newUser = new auditor_1.default({
        userType: "auditor",
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    
    //Process auditor registration
    //Check if the user already exist    
    (0, trainerExists.checkIfTrainerNameIsTaken)(req).then(result =>{ 
        console.log(result);

        if(result === "true")
        {
            req.flash('registerMessage', 'Registration Error - user exists');
            return res.redirect('/administrator/registerAuditor');
        }
        else
        {
            (0, seekerExists.checkIfSeekerNameIsTaken)(req).then(result =>{ 
                console.log(result);
        
                if(result === "true")
                {
                    req.flash('registerMessage', 'Registration Error - user exists');
                    return res.redirect('/administrator/registerAuditor');
                }
                else
                {
                    (0, administratorExists.checkIfAdministratorNameIsTaken)(req).then(result =>{ 
                        
                
                        if(result === "true")
                        {
                            req.flash('registerMessage', 'Registration Error - user exists');
                            return res.redirect('/administrator/registerAuditor');
                        }
                        else
                        {
                            auditor_1.default.register(newUser, req.body.password, (err) => {
                                if (err) {
                                    console.error('Error: Inserting New User');
                                    if (err.name == "UserExistsError") {
                                        req.flash('registerMessage', 'Registration Error');
                                    }
                                    console.log('Error: User Already Exists');
                                    return res.redirect('/administrator/registerAuditor');
                                }
                                
                                    return res.redirect('/administrator/displayAdministratorHome');
                                
                            });
                        }
                            
                    
                   
                    }) 
                }
                    
            
           
            }) 
           
        }
            
    
   
    })
}
exports.ProcessRegisterAuditorPage = ProcessRegisterAuditorPage;

function DisplayRegisterAdministratorPage(req, res, next) {
    if (!req.user) {
        return res.render('administratorViews/administratorIndex', { title: 'Administrator registration', page: 'registerAdministrator', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
    }
    
    return res.redirect('/tennis');
}
exports.DisplayRegisterAdministratorPage = DisplayRegisterAdministratorPage;

function ProcessRegisterAdministratorPage(req, res, next) {
    console.log(req.body.emailAddress);
    let newUser = new administrator_1.default({
        userType: "administrator",
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    
    //Process auditor registration
    //Check if the user already exist    
    (0, trainerExists.checkIfTrainerNameIsTaken)(req).then(result =>{ 
        console.log(result);

        if(result === "true")
        {
            req.flash('registerMessage', 'Registration Error - user exists');
            return res.redirect('/administrator/registerAdministrator');
        }
        else
        {
            (0, seekerExists.checkIfSeekerNameIsTaken)(req).then(result =>{ 
                console.log(result);
        
                if(result === "true")
                {
                    req.flash('registerMessage', 'Registration Error - user exists');
                    return res.redirect('/administrator/registerAdministrator');
                }
                else
                {
                    (0, auditorExists.checkIfAuditorNameIsTaken)(req).then(result =>{ 
                        
                
                        if(result === "true")
                        {
                            req.flash('registerMessage', 'Registration Error - user exists');
                            return res.redirect('/administrator/registerAdministrator');
                        }
                        else
                        {
                            administrator_1.default.register(newUser, req.body.password, (err) => {
                                if (err) {
                                    console.error('Error: Inserting New User');
                                    if (err.name == "UserExistsError") {
                                        req.flash('registerMessage', 'Registration Error');
                                    }
                                    console.log('Error: User Already Exists');
                                    return res.redirect('/administrator/registerAdministrator');
                                }
                                return passport.authenticate('administratorLocal')(req, res, () => {
                                    return res.redirect('/administrator/displayAdministratorHome');
                                });
                            });
                        }
                            
                    
                   
                    }) 
                }
                    
            
           
            }) 
           
        }
            
    
   
    })
}
exports.ProcessRegisterAdministratorPage = ProcessRegisterAdministratorPage;

function DisplayAdministratorHome(req, res, next) {
    res.render('administratorViews/administratorIndex', { title: 'Administrator Home Page', page: 'administratorHome', displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayAdministratorHome = DisplayAdministratorHome;

function DisplayAdministratorSearch(req, res, next) {
    res.render('administratorViews/administratorIndex', { title: 'Administrator Search Page', page: 'administratorSearch', displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayAdministratorSearch = DisplayAdministratorSearch;

function ProcessAdministratorSearchPage(req, res, next) {
    
    var deferred = q_1.default.defer();
    let userType = req.body.userType;
    let username = req.body.username;
    
   
        if ( userType === "Trainer") {
            tennisTrainer.default.find({
                "username": username
                
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    let trainer = " ";
                    docs.forEach(function fn(doc) {
                       trainer = doc;
                    });
                    deferred.resolve({
                        trainer: trainer,
                        respond: res.render('administratorViews/administratorIndex', { title: 'Trainer Search Result', page: 'trainerSearchResult', trainer: trainer, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: req.body.username, userType: req.body.userType })
                    });
                }
            });
        }
        
        else if ( userType === "Seeker") {
            tennisTrainerSeeker.default.find({
                "username": username
                
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    let seeker = " ";
                    docs.forEach(function fn(doc) {
                       seeker = doc;
                    });
                    deferred.resolve({
                        seeker: seeker,
                        respond: res.render('administratorViews/administratorIndex', { title: 'Seeker Search Result', page: 'seekerSearchResult', seeker: seeker, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: req.body.username, userType: req.body.userType })
                    });
                }
            });
        }

        else if ( userType === "Auditor") {
            auditor_1.default.find({
                "username": username
                
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    let auditor = " ";
                    docs.forEach(function fn(doc) {
                       auditor = doc;
                    });
                    deferred.resolve({
                        auditor: auditor,
                        respond: res.render('administratorViews/administratorIndex', { title: 'Auditor Search Result', page: 'auditorSearchResult', auditor: auditor, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: req.body.username, userType: req.body.userType })
                    });
                }
            });
        }
    
        
}
exports.ProcessAdministratorSearchPage = ProcessAdministratorSearchPage;

function DisplayBlockTrainer(req, res, next) {
    return res.render('administratorViews/administratorIndex', { title: 'Block trainer',trainer: req.params.user ,  page: 'blockTrainer', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayBlockTrainer = DisplayBlockTrainer;

function ProcessBlockTrainer(req, res, next) {
    let user = req.params.user;
}
exports.ProcessBlockTrainer = ProcessBlockTrainer;
