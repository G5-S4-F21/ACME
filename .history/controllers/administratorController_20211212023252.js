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
    console.log(req.body.userType);
    var deferred = q_1.default.defer();
    let province = req.body.province;
    let city = req.body.city;
    let minAmount = 0;
    let maxAmount = 51;
    if (province && !city) {
        if ((0, rateIndex_1.rateIndex)(req) === "1") {
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "2") {
            minAmount = 50;
            maxAmount = 101;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "3") {
            minAmount = 100;
            maxAmount = 201;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "4") {
            minAmount = 200;
            maxAmount = 301;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "5") {
            minAmount = 300;
            maxAmount = 401;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "6") {
            minAmount = 399;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
    }
    else if (province && city) {
        if ((0, rateIndex_1.rateIndex)(req) === "1") {
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "2") {
            minAmount = 50;
            maxAmount = 101;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "3") {
            minAmount = 100;
            maxAmount = 201;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "4") {
            minAmount = 200;
            maxAmount = 301;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "5") {
            minAmount = 300;
            maxAmount = 401;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "6") {
            minAmount = 399;
            tennisTrainer_1.default.find({
                "province": req.body.province,
                "city": req.body.city,
                "approvedByAuditor": "true",
                "hourlyRate": { $gt: minAmount },
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req)})
                    });
                }
            });
        }
    }
    else {
        if ((0, rateIndex_1.rateIndex)(req) === "1") {
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "2") {
            minAmount = 50;
            maxAmount = 101;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "3") {
            minAmount = 100;
            maxAmount = 201;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "4") {
            minAmount = 200;
            maxAmount = 301;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "5") {
            minAmount = 300;
            maxAmount = 401;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount, $lt: maxAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
        else if ((0, rateIndex_1.rateIndex)(req) === "6") {
            minAmount = 399;
            tennisTrainer_1.default.find({
                "hourlyRate": { $gt: minAmount },
                "approvedByAuditor": "true",
                $or: [{ "sex": req.body.sex }, { "anyGender": req.body.sex }]
            }, function (err, docs) {
                if (err) {
                    console.log('Error Finding Files');
                    deferred.reject(err);
                }
                else {
                    var names = [];
                    docs.forEach(function fn(doc) {
                        var item = { title: `${doc.displayName}`, description: '${doc.aboutMe}', username: `${doc.username}`, hourlyRate: `${doc.hourlyRate}` };
                        names.push(item);
                    });
                    deferred.resolve({
                        names: names,
                        respond: res.render('seekerViews/seekerIndex', { title: 'Search Results', page: 'searchResult', name: names, displayName: (0, Util_1.UserDisplayName)(req) })
                    });
                }
            });
        }
    }
}
exports.ProcessAdministratorSearchPage = ProcessAdministratorSearchPage;
