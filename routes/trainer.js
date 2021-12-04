let express = require('express');
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let UserModel = require('../models/users');
let User = UserModel.User;

let trainerController = require("../controllers/trainerController");
const indexController = require("../controllers/indexController");

function requireAuth(req, res, next)
{
    if(!req.session){
        return res.redirect('/login');
    }
    next();
}

//router.get('/photoGallery');

//router.get('/profile', trainerController.renderIndex);

router.get('/schedule', trainerController.renderScheduleView);
router.post('/schedule', requireAuth, trainerController.renderDetailedView);

// display fill certificate for a trainer view
router.get('/certificate', trainerController.renderCertificateView);
router.post('/certificate', trainerController.trainerFillCertificate);

router.post('/setAppt', requireAuth, trainerController.renderSetAppt);

router.post('/confirmDetailed', trainerController.confirmAppt)

router.post('/delete', trainerController.deleteAppt);

module.exports = router;
