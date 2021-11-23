var express = require('express');
var router = express.Router();

let indexController = require('../controllers/indexController');

//renders the home page
router.get('/', indexController.renderIndex);
//renders the create account page
router.get('/createAccount', indexController.createAccount);
//handle the post from createAccount
router.post('/createAccount', indexController.handleCreateAccount);

module.exports = router;
