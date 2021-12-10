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

//the infamous schedule
router.get('/schedule', requireAuth, seekerController.renderSeekerSchedule);

router.post('/schedule', requireAuth, seekerController.renderDetailedView);

router.post('/download', requireAuth, seekerController.downloadSchedule);

router.post('/confirmDetailed', requireAuth, seekerController.confirmAppt);

router.post('/delete', requireAuth, seekerController.confirmDelete);

router.post('/setAppt', requireAuth, seekerController.setAppt);

//dealing with the secrets page
router.get('/search', requireAuth, seekerController.renderSeekerSearch);

router.post('/search', requireAuth, seekerController.performSearch);

router.get('/favorite/:id', requireAuth, seekerController.setFavorite);

//viewing favorites page
router.get('/favorites', requireAuth, seekerController.renderFavorites);

//dealing with accounts
router.get('/account', seekerController.renderAccountChoices);

router.get('/secret', requireAuth, seekerController.renderAccountPage);
router.post('/secret', requireAuth, seekerController.updateSecret);
router.get('/notsecret', requireAuth, seekerController.renderPublicPage);
router.post('/notsecret', requireAuth, seekerController.updateProfile);


module.exports = router;