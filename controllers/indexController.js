const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
let url = require('url');


let UserModel = require('../models/users');
let User = UserModel.User;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ uname: username}, function(err, user) {
            if(err) {return done(err); }
            if(!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if(!user.validPassword(password)) {
                return done(null, false, {message: 'in'});
            }
            return done(null, user);
        });
    }
));



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
//renders the login page
module.exports.login = (req, res, next) => {
    res.render('login', { title: "Login"});
}
module.exports.handleLogin = (req, res, next) => {
    // passport login
    passport.authenticate('local', 
    (err, user, info) => {
        if(err)
        {
            return next(err);
        }
        //console.log(user);
        if(!user)
        {
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if(err){
                return next(err);
            }
            if(user.accountType == "trainer")
            {
                res.render('homePages/trainerHome', { name: user.displayName, title: "Trainer" });
            }
            else if(user.accountType == "seeker")
            {
                res.render('homePages/seekerHome', { name: user.displayName, title: "Seeker" });
            }
            else if(user.accountType == "admin")
            {
                res.render('homePages/adminHome', { name: user.displayName, title: "Admin" });
            }
            else if(user.accountType == "auditor")
            {
                res.render('homePages/auditorHome', { name: user.name, title: "Audior" });
            }
            else
            {
                res.render('homePages/defaultHome', { name: "Visitor", title: "Visitor"});
            }
        });
    })(req, res, next);
}