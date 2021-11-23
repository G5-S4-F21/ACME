const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
let url = require('url');


let UserModel = require('../models/users');
let User = UserModel.User;





//should render ../views/index.ejs//
module.exports.renderIndex = (req, res, next) => {
    res.render('index', { title: 'Tennis Assistant' });
}
module.exports.createAccount = (req, res, next) => {
    res.render('createAccount', { title: "Create Account"});
}
module.exports.handleCreateAccount = (req, res, next) => {
    //User account creation
    let tempUser = User({
            username: req.body.uname,
            password: req.body.password,
            accountType: req.body.acctType
        });
        //console.log(tempUser);
        User.register(tempUser, req.body.password, (err) => {
            if(err)
            {
                 if(err.name == "UserExistsError"){
                 /*req.flash(
                        'registerMessage',
                        'Registration Error: User Already Exists!'
                 );*/
                 console.log("Error: User Already Exists");
             }
                return res.render('createAccount', {
                    title: 'Register',
                    //messages: req.flash('register'),
                    displayName: req.user ? req.user.displayname: ''   
                });
            }
            else
            {
                 //successful registration to the confirm account details page
                return passport.authenticate('local')(req, res, ()=>{
                    res.render('confCreateAccount', {title: "Account Confirmation" })
                })
            }
        });
}
