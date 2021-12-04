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
    //if(!req.session.user_email){
    if(!req.session){
        return res.redirect('/login');
    }
    next();
}

router.get('/schedule', requireAuth, seekerController.renderSeekerSchedule);

router.post('/schedule', requireAuth, seekerController.renderDetailedView);

router.post('/setAppt', requireAuth, seekerController.setAppt);

router.get('/search', requireAuth, seekerController.renderSeekerSearch);

router.post('/search', requireAuth, seekerController.performSearch);

router.get('/favorites', requireAuth, seekerController.renderFavorites);
module.exports = router;