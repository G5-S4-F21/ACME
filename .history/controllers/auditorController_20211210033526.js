'use.strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
let express = require('express');
const mongoose = __importDefault(require("mongoose"));
let MongoClient = require('mongodb').MongoClient;
let db = require('../config/db');
const photoDb = mongoose.default.connection;
let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let ProfileModel = require('../models/profile');
let Profile = ProfileModel.Profile;
let UserModel = require('../models/users')
let User = UserModel.User;
const Util_1 = require('../Utils/auditor.js');
let indexController = require("../controllers/indexController");
const q_1 = __importDefault(require("q"));
const tennisTrainer_1 = __importDefault(require("../models/tennisTrainer"));
const auditor_2 = require("../Utils/auditor");
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
                respond: res.render('auditorViews/auditorIndex', { title: 'List of pending auditor requests', page: 'trainerJoinRequest', name: names, displayName: (0, auditor_2.AuditorDisplayName)(req) })
            });
        }
    });
}
exports.DisplayPendingTrainerJoinRequests = DisplayPendingTrainerJoinRequests;

function DisplayTrainerRequestDetails(req, res, next) {
    var deferred = q_1.default.defer();
    let trainerName = req.params.username;
    tennisTrainer_1.default.find({
        "username": trainerName
    }, function (err, docs) {
        if (err) {
            console.log('Error Finding Files');
            deferred.reject(err);
        }
        else {
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
            docs.forEach(function fn(doc) {
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
                respond: res.render('auditorViews/auditorIndex', { title: 'Trainer Join Request Details', page: 'trainerRequestDetails', username: trainerName, certificate: certificate, city: city, province: province, age: age, sex: sex, hourlyRate: hourlyRate, aboutMe: aboutMe, emailAddress: emailAddress, displayNameFromQuery: displayName, phoneNumber: phoneNumber, username: trainerName, displayName: (0, auditor_2.AuditorDisplayName)(req) })
            });
        }
    });
}
exports.DisplayTrainerRequestDetails = DisplayTrainerRequestDetails;

function GetTrainerCertificate(req, res, next) 
{
    var filename = req.params.id;
    let trainerCertificate = req.params.certificate + "";
    photoDb.collection('certificates').findOne({ 'certificate': trainerCertificate }, (err, result) => {
        if (err)
            return console.log(err);
        res.contentType('image/jpeg');
        res.send(result.image.buffer);
    });
}
exports.GetTrainerCertificate = GetTrainerCertificate;