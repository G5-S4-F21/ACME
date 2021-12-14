'use.strict'
let express = require('express');
let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
let router = express.Router();

let administratorController = require("../controllers/administratorController");

function requireAuth(req, res, next)
{
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

/* GET - Display register auditor page - with /registerAuditor. */
router.get('/registerAuditor', administratorController.DisplayRegisterAuditorPage);
router.post('/registerAuditor', administratorController.ProcessRegisterAuditorPage);
router.get('/registerAdministrator', administratorController.DisplayRegisterAdministratorPage);
router.post('/registerAdministrator', administratorController.ProcessRegisterAdministratorPage);
router.get('/displayAdministratorHome', administratorController.DisplayAdministratorHome);
router.get('/displayAdministratorSearch', administratorController.DisplayAdministratorSearch);
router.post('/displayAdministratorSearch', administratorController.ProcessAdministratorSearchPage);
module.exports = router;