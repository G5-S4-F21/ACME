const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
let url = require('url');

// refer to user DB
let UserModel = require('../models/users');
let User = UserModel.User;

// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

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
    res.render('index', { title: 'Tennis Assistant', page: 'defaultHome' });
}
module.exports.createAccount = (req, res, next) => {
    res.render('index', { title: "Create Account", page: 'createAccount'});
}
/**
 * create an account
 * @param req
 * @param res
 * @param next
 */
module.exports.handleCreateAccount = (req, res, next) => {
    // based on type of account, create an account
    const {user_account_type}=req.body
    switch (user_account_type){
        case 'trainer_seeker':
            // TODO:register trainer seeker
            console.log('handle trainer seeker DB')
            break
        case 'trainer':
            // TODO:register trainer seek
            registerTrainer(req, res)
            break
        case 'auditor':
            // TODO:register trainer seek
            console.log('handle auditor DB')
            break
        default:
            break
    }
    //User account creation
    // let currentUser = User({
    //         username: req.body.uname,
    //         password: req.body.password,
    //         accountType: req.body.acctType
    //     });
    //     //console.log(tempUser);
    //     User.register(currentUser, req.body.password, (err) => {
    //         if(err)
    //         {
    //              if(err.name == "UserExistsError"){
    //              /*req.flash(
    //                     'registerMessage',
    //                     'Registration Error: User Already Exists!'
    //              );*/
    //              console.log("Error: User Already Exists");
    //          }
    //             return res.render('createAccount', {
    //                 title: 'Register',
    //                 //messages: req.flash('register'),
    //                 displayName: req.user ? req.user.displayname: ''
    //             });
    //         }
    //         else
    //         {
    //              //successful registration to the confirm account details page
    //             return passport.authenticate('local')(req, res, ()=>{
    //                 res.render('confCreateAccount', {title: "Account Confirmation" })
    //             })
    //         }
    //     });
}

/**
 * register trainer
 * @param req
 * @param res
 */
const registerTrainer=(req,res)=>{
    console.log(req.body)
    Trainer.find({trainerEmail:req.body.user_email}, (err, trainer_seekers) =>{
        if(err){
            console.log(err)
            res.redirect('/createAccount')
            return res.send('-2') // server err
        }

        if(trainer_seekers[0]){
            res.redirect('/createAccount')
            return res.send('1') // trainer seeker already exists
        }else{
            // can register
            let trainerSeeker=new Trainer({
                trainerEmail:req.body.user_email,
                trainerPassword:req.body.user_password,
                trainerCellphone:req.body.user_cellphone_number
            })

            trainerSeeker.save().then(()=>{
                // save session
                req.session.user_email=req.body.user_email
                req.session.user_password=req.body.user_password
                req.session.user_account_type=req.body.user_account_type
                res.redirect('/')
                return res.send('0')
            })

        }
    })
}

function DisplayLoginPage(req, res, next) {
    if(req.user)
    {
        if(req.user.userType === 'seeker')
        {
            return res.redirect('/seeker/displaySeekerHome');
            
        }    
    }
    
    if (!req.user) {
        return res.render('index', { title: 'Login', page: 'login', messages: req.flash('loginMessage') });
    }
    //TO DO
    return res.redirect('/');
}
exports.DisplayLoginPage = DisplayLoginPage;

function ProcessLoginPage(req, res, next) {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            return res.redirect('/seeker/displaySeekerHome');
        });
    })(req, res, next);
}
exports.ProcessLoginPage = ProcessLoginPage;

function ProcessLogoutPage(req, res, next) {
    req.logout();
    return res.redirect('login');
}
exports.ProcessLogoutPage = ProcessLogoutPage;
