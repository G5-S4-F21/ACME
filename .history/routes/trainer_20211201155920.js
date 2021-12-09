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

module.exports = router;