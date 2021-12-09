'use.strict'
let express = require('express');
let passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let UserModel = require('../models/users');
let User = UserModel.User;

let seekerController = require("../controllers/seekerController");

function requireAuth(req, res, next)
{
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

router.get('/schedule', requireAuth, seekerController.renderSeekerSchedule);

router.post('/schedule', requireAuth, seekerController.renderDetailedView);

/* Seeker routes */
router.get('/registerSeeker', seekerController.DisplayRegisterSeekerPage);
router.post('/registerSeeker', seekerController.ProcessRegisterSeekerPage);
router.get('/displaySeekerHome', seekerController.DisplaySeekerHome);
module.exports = router;