let express = require('express');
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
let router = express.Router();

let trainerController = require("../controllers/trainerController");
const auditorController = require("../controllers/auditorController");

function requireAuth(req, res, next)
{
    if(!req.session){
        return res.redirect('/login');
    }
    next();
}

// render view all trainer view
router.get('/allTrainers', auditorController.renderAllTrainersView)

// pass audit
router.post('/passAudit', auditorController.passAudit)

module.exports = router;
