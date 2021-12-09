const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
let url = require('url');
const { v4: uuidv4 } = require('uuid')
let nodemailer  = require('nodemailer')
// refer to user DB
let UserModel = require('../models/users');
let User = UserModel.User;

// refer to trainer DB
const TrainerModel=require('../models/tennisTrainer')
const Trainer=TrainerModel.Trainer

const mailTransport = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
        user: "wangxiaobei666@hotmail.com",
        pass: "13ULovEi14962464"
    }
});

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

    //handle login for tennis trainer seeker
    if(req.body.userAccountType === 'Trainer Seeker')
    {   
        passport.authenticate('seekerLocal', (err, user, info) => {
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

    else if(req.body.userAccountType === 'Trainer')
    {
        passport.authenticate('trainerLocal', (err, user, info) => {
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
                let username = req.body.username;
                return res.redirect('/trainer/displayTrainerHome/'+ `${username}`);
            });
        })(req, res, next);
    }
    
}
exports.ProcessLoginPage = ProcessLoginPage;

function ProcessLogoutPage(req, res, next) {
    req.logout();
    return res.redirect('login');
}
exports.ProcessLogoutPage = ProcessLogoutPage;

/**
 * render reset password page
 * @param req
 * @param res
 * @param next
 */
 module.exports.renderForgetPasswordView=(req,res,next)=>{
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    res.render('index',{
        title:'Recover password',
        page: 'forgetPasswordView',
        userInfo
    })
}

/**
 * send reset password email
 * @param req
 * @param res
 * @param next
 */
 module.exports.sendRecoverPasswordEmail=(req,res,next)=>{
    const {user_account_type}=req.query
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    switch (user_account_type){
        case 'Trainer':
            // find from Trainer DB
            findTrainerByEmail(req,res)
            break
        case 'Trainer Seeker':
            // find from Trainer Seeker DB
            //findTrainerSeekerByEmail(req,res)
            break
        case 'Auditor':
            // TODO: find from Auditor DB
            break
        case 'Admin':
            // TODO: find from Admin DB
            break
        default:
            break
    }
}

/**
 * find trainer by email
 * @param req
 * @param res
 */
 const findTrainerByEmail=(req, res)=>{
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    TrainerModel.default.find({emailAddress:req.query.user_email}, (err, trainers)=>{
        if(err){
            return res.send('-2') // server error
        }else if(!trainers[0]){
            return res.send('0') // no such user
        }else{
            // find user and ready to recover password email
            //send an email to my email
            const options = {
                from        : '"My Personal Website" <wangxiaobei666@hotmail.com>',
                to          : req.query.user_email,
                subject        : 'An email from G5-S4-F21/ACME',
                // text          : 'An email from my website',

                html           : '<h4>Please click the link below to reset your password</h4><p>' +
                    '<p>From: G5-S4-F21/ACME</p>' +
                    '<p><a href="http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+trainers[0]._id+'">http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+trainers[0]._id+'</a>'
            };

            mailTransport.sendMail(options, function(err, msg){
                if(err){
                    console.log(err);
                    res.render('index', { title: err, page: 'defaultHome', userInfo });
                }
                else {
                    console.log(msg);
                    res.render('index', { title: "Received："+msg.accepted, page: 'defaultHome', userInfo});
                }
            })
        }
    })
}

/**
 * render reset password view
 * @param req
 * @param res
 * @param next
 */
 module.exports.renderResetPasswordView = (req,res,next)=>{
    // console.log(req.query.accountType,req.query.UUID)
    const userInfo={}
    console.log(req.query.accountType)
    res.render('index', {
        title:'Reset password',
        page: 'resetPasswordView',
        account_type:req.query.accountType.replace(' ', ''),
        UUID: req.query.UUID,
        userInfo
    })
}

/**
 * reset password by account type and UUID
 * @param req
 * @param res
 * @param next
 */
 module.exports.resetPasswordByAccountTypeAndUUID=(req,res,next)=>{
    const {account_type}=req.body
    console.log(account_type)
    // find this user by account type and UUID
    switch (account_type){
        case 'Trainer':
            // find this user in trainer DB by UUID
            findTrainerByUUID(req,res)
            break;
        case 'TrainerSeeker':
            // find this user in trainer seeker DB by UUID
            //findTrainerSeekerByUUID(req,res)
            break;
        case 'Auditor':
            // TODO: find this user in Auditor DB by UUID
            break;
        case 'Admin':
            // TODO: find this user in Admin DB by UUID
            break;
        default:
            break
    }
}

