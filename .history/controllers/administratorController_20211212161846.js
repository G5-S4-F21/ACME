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
    let trainerComment = req.body.comment;
    var deferred = q_1.default.defer();
    let trainerName = req.params.user;
    tennisTrainer.default.find({
        "username": trainerName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let trainer ="";
            let hourlyRate = " ";
            let aboutMe = " ";
            let emailAddress = " ";
            let displayName = " ";
            let phoneNumber = " ";
            let sex = " ";
            let age = " ";
            let province = " ";
            let city = " ";
            let certificate = " ";
            let username = " ";
            let anyGender = " ";
            let birthDate = " ";
            let id = " ";
            let unblockedNotes = " ";
            let admin = req.user.username;
            let blocked = "true";
            let blockedNotes = "Admin username: "+ admin + "\n"+ "Admin comment: "+ trainerComment ;
            let approvedByAuditor = " ";
            docs.forEach(function fn(doc) {
                trainer = doc;
                hourlyRate = `${doc.hourlyRate}`;
                aboutMe = `${doc.aboutMe}`;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                phoneNumber = `${doc.phoneNumber}`;
                sex = `${doc.sex}`;
                age = `${doc.age}`;
                province = `${doc.province}`;
                city = `${doc.city}`;
                certificate = `${doc.certificate}`;
                username = `${doc.username}`;
                anyGender = `${doc.anyGender}`;
                birthDate = `${doc.birthDate}`;
                id = `${doc._id}`;
                blocked = "true";
                blockedNotes = "Admin that blocked this user: "+ admin + "\n"+ "Admins reason for blocking this user: "+ trainerComment;
                unblockedNotes = " ";
                approvedByAuditor = `${doc.approvedByAuditor}`;
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
                certificate: certificate,
                approvedByAuditor: approvedByAuditor,
                username: username,
                anyGender: anyGender,
                birthDate: birthDate,
                id: id,
                blocked: blocked,
                blockedNotes: blockedNotes,
                unblockedNotes: unblockedNotes
            });
            let updatedTrainer = new tennisTrainer.default({
                _id: id,
                hourlyRate: hourlyRate,
                aboutMe: aboutMe,
                certificate: certificate,
                userType: "trainer",
                username: username,
                anyGender: "Any gender",
                emailAddress: emailAddress,
                age: age,
                phoneNumber: phoneNumber,
                sex: sex,
                birthDate: birthDate,
                province: province,
                city: city,
                approvedByAuditor: approvedByAuditor,
                blocked: blocked,
                administratorThatBlockedNotes: blockedNotes,
                administratorThatUnBlockedNotes: unblockedNotes,
                displayName: displayName
            });
            tennisTrainer.default.updateOne({ _id: id }, updatedTrainer, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                    
                }
                
                respond: res.render('administratorViews/administratorIndex', { title: 'Trainer Search Result', page: 'trainerSearchResult', trainer: updatedTrainer, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: username, userType: req.body.userType })
            });
        }
    });
}
exports.ProcessBlockTrainer = ProcessBlockTrainer;

function DisplayUnblockTrainer(req, res, next) {
    return res.render('administratorViews/administratorIndex', { title: 'Unblock trainer',trainer: req.params.user ,  page: 'unblockTrainer', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayUnblockTrainer = DisplayUnblockTrainer;

function ProcessUnblockTrainer(req, res, next) {
    let trainerComment = req.body.comment;
    var deferred = q_1.default.defer();
    let trainerName = req.params.user;
    tennisTrainer.default.find({
        "username": trainerName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let trainer ="";
            let hourlyRate = " ";
            let aboutMe = " ";
            let emailAddress = " ";
            let displayName = " ";
            let phoneNumber = " ";
            let sex = " ";
            let age = " ";
            let province = " ";
            let city = " ";
            let certificate = " ";
            let username = " ";
            let anyGender = " ";
            let birthDate = " ";
            let id = " ";
            let unblockedNotes = " ";
            let admin = req.user.username;
            let blocked = "false";
            let blockedNotes = " " ;
            let approvedByAuditor = " ";
            docs.forEach(function fn(doc) {
                trainer = doc;
                hourlyRate = `${doc.hourlyRate}`;
                aboutMe = `${doc.aboutMe}`;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                phoneNumber = `${doc.phoneNumber}`;
                sex = `${doc.sex}`;
                age = `${doc.age}`;
                province = `${doc.province}`;
                city = `${doc.city}`;
                certificate = `${doc.certificate}`;
                username = `${doc.username}`;
                anyGender = `${doc.anyGender}`;
                birthDate = `${doc.birthDate}`;
                id = `${doc._id}`;
                blocked = "false";
                blockedNotes = `${doc.administratorThatBlockedNotes}`;
                unblockedNotes = "Admin that unblocked this user: "+ admin + "\n"+ "Admin reason for unblocking this user: "+ trainerComment;
                approvedByAuditor = `${doc.approvedByAuditor}`;
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
                certificate: certificate,
                approvedByAuditor: approvedByAuditor,
                username: username,
                anyGender: anyGender,
                birthDate: birthDate,
                id: id,
                blocked: blocked,
                blockedNotes: blockedNotes,
                unblockedNotes: unblockedNotes
            });
            let updatedTrainer = new tennisTrainer.default({
                _id: id,
                hourlyRate: hourlyRate,
                aboutMe: aboutMe,
                certificate: certificate,
                userType: "trainer",
                username: username,
                anyGender: "Any gender",
                emailAddress: emailAddress,
                age: age,
                phoneNumber: phoneNumber,
                sex: sex,
                birthDate: birthDate,
                province: province,
                city: city,
                approvedByAuditor: approvedByAuditor,
                blocked: blocked,
                administratorThatBlockedNotes: blockedNotes,
                administratorThatUnBlockedNotes: unblockedNotes,
                displayName: displayName
            });
            tennisTrainer.default.updateOne({ _id: id }, updatedTrainer, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                    
                }
                
                respond: res.render('administratorViews/administratorIndex', { title: 'Trainer Search Result', page: 'trainerSearchResult', trainer: updatedTrainer, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: username, userType: req.body.userType })
            });
        }
    });
}
exports.ProcessUnblockTrainer = ProcessUnblockTrainer;

function DisplayBlockSeeker(req, res, next) {
    return res.render('administratorViews/administratorIndex', { title: 'Block seeker',seeker: req.params.user ,  page: 'blockSeeker', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayBlockSeeker = DisplayBlockSeeker;

function ProcessBlockSeeker(req, res, next) {
    let seekerComment = req.body.comment;
    var deferred = q_1.default.defer();
    let seekerName = req.params.user;
    tennisTrainerSeeker.default.find({
        "username": seekerName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let emailAddress = " ";
            let displayName = " ";
            let username = " ";
            let id = " ";
            let unblockedNotes = " ";
            let admin = req.user.username;
            let blocked = "true";
            let blockedNotes = "Admin username: "+ admin + "\n"+ "Admin comment: "+ seekerComment ;
           
            docs.forEach(function fn(doc) {
                seeker = doc;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                username = `${doc.username}`;
                id = `${doc._id}`;
                blocked = "true";
                blockedNotes = "Admin that blocked this user: "+ admin + "\n"+ "Admins reason for blocking this user: "+ seekerComment;
                unblockedNotes = " ";
               
            });
            deferred.resolve({
                emailAddress: emailAddress,
                displayName: displayName,
                username: username,
                id: id,
                blocked: blocked,
                blockedNotes: blockedNotes,
                unblockedNotes: unblockedNotes
            });
            let updatedTrainerSeeker = new tennisTrainerSeeker.default({
                _id: id,
                userType: "seeker",
                username: username,
                emailAddress: emailAddress,
                blocked: blocked,
                administratorThatBlockedNotes: blockedNotes,
                administratorThatUnBlockedNotes: unblockedNotes,
                displayName: displayName
            });
            tennisTrainerSeeker.default.updateOne({ _id: id }, updatedTrainerSeeker, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                    
                }
                
                respond: res.render('administratorViews/administratorIndex', { title: 'Seeker Search Result', page: 'seekerSearchResult', seeker: updatedTrainerSeeker, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: username, userType: req.body.userType })
            });
        }
    });
}
exports.ProcessBlockSeeker = ProcessBlockSeeker;

function DisplayUnblockSeeker(req, res, next) {
    return res.render('administratorViews/administratorIndex', { title: 'Unblock seeker',seeker: req.params.user ,  page: 'unblockSeeker', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayUnblockSeeker = DisplayUnblockSeeker;

function ProcessUnblockSeeker(req, res, next) {
    let seekerComment = req.body.comment;
    var deferred = q_1.default.defer();
    let seekerName = req.params.user;
    tennisTrainerSeeker.default.find({
        "username": seekerName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let emailAddress = " ";
            let displayName = " ";
            let username = " ";
            let id = " ";
            let unblockedNotes = " ";
            let admin = req.user.username;
            let blocked = "true";
            let blockedNotes = " " ;
           
            docs.forEach(function fn(doc) {
                seeker = doc;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                username = `${doc.username}`;
                id = `${doc._id}`;
                blocked = "false";
                blockedNotes = `${doc.administratorThatBlockedNotes}`;
                unblockedNotes = "Admin that unblocked this user: "+ admin + "\n"+ "Admins reason for unblocking this user: "+ seekerComment;
               
            });
            deferred.resolve({
                emailAddress: emailAddress,
                displayName: displayName,
                username: username,
                id: id,
                blocked: blocked,
                blockedNotes: blockedNotes,
                unblockedNotes: unblockedNotes
            });
            let updatedTrainerSeeker = new tennisTrainerSeeker.default({
                _id: id,
                userType: "trainer",
                username: username,
                emailAddress: emailAddress,
                blocked: blocked,
                administratorThatBlockedNotes: blockedNotes,
                administratorThatUnBlockedNotes: unblockedNotes,
                displayName: displayName
            });
            tennisTrainerSeeker.default.updateOne({ _id: id }, updatedTrainerSeeker, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                    
                }
                
                respond: res.render('administratorViews/administratorIndex', { title: 'Seeker Search Result', page: 'seekerSearchResult', seeker: updatedTrainerSeeker, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: username, userType: req.body.userType })
            });
        }
    });

}
exports.ProcessUnblockSeeker = ProcessUnblockSeeker;

function DisplayBlockAuditor(req, res, next) {
    return res.render('administratorViews/administratorIndex', { title: 'Block auditor',auditor: req.params.user ,  page: 'blockAuditor', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayBlockAuditor = DisplayBlockAuditor;

function ProcessBlockAuditor(req, res, next) {
    let auditorComment = req.body.comment;
    var deferred = q_1.default.defer();
    let auditorName = req.params.user;
    auditor_1.default.find({
        "username": auditorName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let emailAddress = " ";
            let displayName = " ";
            let username = " ";
            let id = " ";
            let unblockedNotes = " ";
            let admin = req.user.username;
            let blocked = "true";
            let blockedNotes = "Admin username: "+ admin + "\n"+ "Admin comment: "+ auditorComment ;
           
            docs.forEach(function fn(doc) {
                auditor = doc;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                username = `${doc.username}`;
                id = `${doc._id}`;
                blocked = "true";
                blockedNotes = "Admin that blocked this user: "+ admin + "\n"+ "Admins reason for blocking this user: "+ auditorComment;
                unblockedNotes = " ";
               
            });
            deferred.resolve({
                emailAddress: emailAddress,
                displayName: displayName,
                username: username,
                id: id,
                blocked: blocked,
                blockedNotes: blockedNotes,
                unblockedNotes: unblockedNotes
            });
            let updatedAuditor = new auditor_1.default({
                _id: id,
                userType: "auditor",
                username: username,
                emailAddress: emailAddress,
                blocked: blocked,
                administratorThatBlockedNotes: blockedNotes,
                administratorThatUnBlockedNotes: unblockedNotes,
                displayName: displayName
            });
            auditor_1.default.updateOne({ _id: id }, updatedAuditor, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                    
                }
                
                respond: res.render('administratorViews/administratorIndex', { title: 'Auditor Search Result', page: 'auditorSearchResult', auditor: updatedAuditor, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: username, userType: req.body.userType })
            });
        }
    });
}
exports.ProcessBlockAuditor = ProcessBlockAuditor;

function DisplayUnblockAuditor(req, res, next) {
    return res.render('administratorViews/administratorIndex', { title: 'Unblock auditor', auditor: req.params.user ,  page: 'unblockAuditor', messages: req.flash('registerMessage'), displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayUnblockAuditor = DisplayUnblockAuditor;

function ProcessUnblockAuditor(req, res, next) {
    let auditorComment = req.body.comment;
    var deferred = q_1.default.defer();
    let auditorName = req.params.user;
    auditor_1.default.find({
        "username": auditorName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
            let emailAddress = " ";
            let displayName = " ";
            let username = " ";
            let id = " ";
            let unblockedNotes = " ";
            let admin = req.user.username;
            let blocked = "true";
            let blockedNotes = "Admin username: "+ admin + "\n"+ "Admin comment: "+ auditorComment ;
           
            docs.forEach(function fn(doc) {
                auditor = doc;
                emailAddress = `${doc.emailAddress}`;
                displayName = `${doc.displayName}`;
                username = `${doc.username}`;
                id = `${doc._id}`;
                blocked = "true";
                blockedNotes = "Admin that blocked this user: "+ admin + "\n"+ "Admins reason for blocking this user: "+ auditorComment;
                unblockedNotes = " ";
               
            });
            deferred.resolve({
                emailAddress: emailAddress,
                displayName: displayName,
                username: username,
                id: id,
                blocked: blocked,
                blockedNotes: blockedNotes,
                unblockedNotes: unblockedNotes
            });
            let updatedAuditor = new auditor_1.default({
                _id: id,
                userType: "auditor",
                username: username,
                emailAddress: emailAddress,
                blocked: blocked,
                administratorThatBlockedNotes: blockedNotes,
                administratorThatUnBlockedNotes: unblockedNotes,
                displayName: displayName
            });
            auditor_1.default.updateOne({ _id: id }, updatedAuditor, {}, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                    
                }
                
                respond: res.render('administratorViews/administratorIndex', { title: 'Auditor Search Result', page: 'auditorSearchResult', auditor: updatedAuditor, displayName: (0, Util_1.AdministratorDisplayName)(req), userSearch: username, userType: req.body.userType })
            });
        }
    });
}
exports.ProcessUnblockAuditor = ProcessUnblockAuditor;

