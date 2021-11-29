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
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

// set up email sender

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
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    console.log(userInfo)
    res.render('index', {
        title: 'Tennis Assistant',
        userInfo
    });
}
/**
 * render register view
 * @param req
 * @param res
 * @param next
 */
module.exports.createAccountView = (req, res, next) => {
    const userInfo={}
    res.render('createAccount', {
        title: "Create Account",
        userInfo:{
            user_email: undefined
        }
    });
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
            // register trainer seek
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
    Trainer.find({trainerEmail:req.body.user_email}, (err, trainers) =>{
        if(err){
            console.log(err)
            return res.send('-2') // server err
        }

        if(trainers[0]){
            return res.send('1') // trainer seeker already exists
        }else{
            // can register
            let trainerSeeker=new Trainer({
                trainerEmail:req.body.user_email,
                trainerPassword:req.body.user_password,
                trainerCellphone:req.body.user_cellphone_number,
                UUID:uuidv4()
            })

            trainerSeeker.save().then(()=>{
                return res.send('0')
            })

        }
    })
}
//renders the login page
module.exports.loginView = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    res.render('login', {
        title: "Login",
        userInfo
    });
}

// module.exports.handleLogin = (req, res, next) => {
//     // passport login
//     passport.authenticate('local',
//     (err, user, info) => {
//         if(err)
//         {
//             return next(err);
//         }
//         //console.log(user);
//         if(!user)
//         {
//             return res.redirect('/login');
//         }
//         req.login(user, (err) => {
//             if(err){
//                 return next(err);
//             }
//             console.log(user.accountType)
//             if(user.accountType == "trainer")
//             {
//
//                 res.render('homePages/trainerHome', { name: user.displayName, title: "Trainer" });
//             }
//             else if(user.accountType == "seeker")
//             {
//                 res.render('homePages/seekerHome', { name: user.displayName, title: "Seeker" });
//             }
//             else if(user.accountType == "admin")
//             {
//                 res.render('homePages/adminHome', { name: user.displayName, title: "Admin" });
//             }
//             else if(user.accountType == "auditor")
//             {
//                 res.render('homePages/auditorHome', { name: user.name, title: "Audior" });
//             }
//             else
//             {
//                 res.render('homePages/defaultHome', { name: "Visitor", title: "Visitor"});
//             }
//         });
//     })(req, res, next);
// }
module.exports.handleLogin=(req, res, next)=>{
    const {user_email, user_password, user_account_type}=req.body
    switch (user_account_type){
        case 'Trainer':
            // TODO: find user in Trainer DB
            findTrainerByEmailAndPassword(req,res)
            break
        case 'Trainer Seeker':
            // TODO: find user in Trainer Seeker DB
            console.log('look for trainer seeker')
            break
        case 'Auditor':
            // TODO: find user in Auditor DB
            console.log('look for auditor')
            break
        case 'Admin':
            // TODO: find user in Admin DB
            console.log('look for admin')
            break
        default:
            break
    }
}

const findTrainerByEmailAndPassword=(req,res)=>{
    Trainer.find({
        trainerEmail: req.body.user_email,
        trainerPassword:req.body.user_password
    }, (err, trainers) =>{
        if(err){
            return res.send('-2') // server error
        }else if(!trainers[0]){
            return res.send('-1') // email or password not right
        }else{
            // save session
            req.session.user_email=req.body.user_email
            req.session.user_password=req.body.user_password
            req.session.user_account_type=req.body.user_account_type
            return res.send('1') // find user successfully
        }
    })
}

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
    res.render('forgetPasswordView',{
        title:'Recover password',
        userInfo
    })
}

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
            // TODO: find from Trainer Seeker DB
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
const findTrainerByEmail=(req, res)=>{
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    Trainer.find({trainerEmail:req.query.user_email}, (err, trainers)=>{
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
                    '<p><a href="http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+trainers[0].UUID+'">http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+trainers[0].UUID+'</a>'
            };

            mailTransport.sendMail(options, function(err, msg){
                if(err){
                    console.log(err);
                    res.render('index', { title: err, userInfo });
                }
                else {
                    console.log(msg);
                    res.render('index', { title: "Received："+msg.accepted, userInfo});
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
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    res.render('resetPasswordView', {
        title:'Reset password',
        account_type:req.query.accountType,
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

    // find this user by account type and UUID
    switch (account_type){
        case 'Trainer':
            findTrainerByUUID(req,res)
            break;
        case 'Trainer Seeker':
            // TODO: find this user in trainer seeker DB by UUID
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

const findTrainerByUUID = (req,res)=>{
    Trainer.findOneAndUpdate({UUID: req.body.UUID}, {
        $set:{
            trainerPassword:req.body.new_password
        }
    }, {},(err, trainer) => {
        if(err){
            // -2: server error
            return res.send('-2')
        }
        if(!trainer){
            // 0: no such user
            return res.send('0')
        }else{
            // reset password
            console.log('updated!')
            return res.send('1')
        }
    })
}
/**
 * logout user
 * @param req
 * @param res
 * @param next
 */
module.exports.logout=(req,res,next)=>{
    if(req.session){
        req.session.destroy((err)=>{
            res.redirect('/')
        })
    }
}
