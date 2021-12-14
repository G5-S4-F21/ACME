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
const Util_1 = require('../Utils/auditor.js');
let indexController = require("../controllers/indexController");

//const tennisTrainerSeeker = __importDefault(require("../models/tennisTrainerSeeker"));

function DisplayRegisterAuditorPage(req, res, next) {
    if (!req.user) {
        return res.render('auditorViews/auditorIndex', { title: 'Auditor registration', page: 'registerAuditor', messages: req.flash('registerMessage'), displayName: (0, Util_1.AuditorDisplayName)(req) });
    }
    
    return res.redirect('/tennis');
}
exports.DisplayRegisterAuditorPage = DisplayRegisterAuditorPage;

function DisplayPendingTrainerJoinRequests(req, res, next) {
    var deferred = q_1.default.defer();
    let province = req.body.province;
    let city = req.body.city;
    let minAmount = 0;
    let maxAmount = 51;
    tennisTrainer_1.default.find({
        "approvedByAuditor": "false",
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
                respond: res.render('auditorIndex', { title: 'List of pending auditor requests', page: 'trainerJoinRequest', name: names, displayName: (0, auditor_2.AuditorDisplayName)(req) })
            });
        }
    });
}
exports.DisplayPendingTrainerJoinRequests = DisplayPendingTrainerJoinRequests;
