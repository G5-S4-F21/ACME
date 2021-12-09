var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
let express = require('express');
let passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let UserModel = require('../models/users');
let User = UserModel.User;
const mongoose = __importDefault(require("mongoose"));
let trainerController = require("../controllers/trainerController");
const multer_1 = __importDefault(require("multer"));
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const db = mongoose.default.connection;
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
var upload = (0, multer_1.default)({ storage: storage });
function requireAuth(req, res, next)
{
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

//router.get('/photoGallery');

//router.get('/profile', trainerController.renderIndex);
router.get('/schedule', trainerController.renderSchedule);
router.post('/schedule', trainerController.renderDetailedView);
//router.get('/schedule', requireAuth, trainerController.renderSchedule);
//router.post('/schedule', requireAuth, trainerController.renderDetailedView);
router.post('/setAppt', trainerController.renderSetAppt);
//router.post('/setAppt', requireAuth, trainerController.renderSetAppt);

/* GET - Display register seeker page - with /registerSeeker. */
router.get('/registerTrainer', trainerController.DisplayRegisterTrainerPage);
router.post('/registerTrainer', (req, res, next) => {
    const file = req.file;
    var img = fs_1.default.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64'),
        certificate: file.filename
    };
    db.collection('quotes').insertOne(finalImg, (err, result) => {
        console.log(result);
        if (err)
            return console.log(err);
        console.log('saved to database');
    });
    let ageCalculation = (0, moment_1.default)().diff(req.body.birthDate, 'years');
    let newUser2 = new tennisTrainer_1.default({
        hourlyRate: req.body.hourlyRate,
        aboutMe: req.body.aboutMe,
        certificate: file.filename,
        userType: "trainer",
        username: req.body.username,
        anyGender: "Any gender",
        emailAddress: req.body.emailAddress,
        age: ageCalculation,
        phoneNumber: req.body.phoneNumber,
        sex: req.body.sex,
        birthDate: req.body.birthDate,
        province: req.body.province,
        city: req.body.city,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    tennisTrainer_1.default.register(newUser2, req.body.password, (err) => {
        if (err) {
            console.error('Error: Inserting New User');
            if (err.name == "UserExistsError") {
                req.flash('registerMessage', 'Registration Error');
            }
            console.log(err);
            console.log('Error: User Already Exists');
            return res.json("not successful");
        }
        return passport_1.default.authenticate('local')(req, res, () => {
            return res.redirect('/home');
        });
    });
});
module.exports = router;