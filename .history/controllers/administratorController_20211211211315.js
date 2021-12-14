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

const auditor_1 = __importDefault(require("../models/auditor"));
const administrator_1 = __importDefault(require("../models/administrator"));
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
exports.ProcessRegisterAdministratorPage = ProcessRegisterAdministratorPage;

function DisplayAdministratorHome(req, res, next) {
    res.render('administratorViews/administratorIndex', { title: 'Administrator Home Page', page: 'administratorHome', displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayAdministratorHome = DisplayAdministratorHome;

function DisplayAdministratorSearch(req, res, next) {
    res.render('administratorViews/administratorIndex', { title: 'Administrator Search Page', page: 'administratorSearch', displayName: (0, Util_1.AdministratorDisplayName)(req) });
}
exports.DisplayAdministratorSearch = DisplayAdministratorSearch;
