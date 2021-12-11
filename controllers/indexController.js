const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

let url = require('url');
const { v4: uuidv4 } = require('uuid')
let nodemailer  = require('nodemailer')

// refer to user DB
let UserModel = require('../models/users');
let User = UserModel.User;

// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer
// refer to trainer seeker DB
const Trainer_seeker_model=require('../models/Trainer_seeker')
const Trainer_seeker=Trainer_seeker_model.Trainer_seeker
//refer to auditor DB
const Auditor_model=require('../models/Auditor')
const Auditor=Auditor_model.Auditor




// set up email sender

const mailTransport = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
        user: "wangxiaobei666@hotmail.com",
        pass: "13ULovEi14962464"
    }
});



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
            // register trainer seeker
            registerTrainerSeeker(req,res)
            break
        case 'trainer':
            // register trainer seek
            registerTrainer(req, res)
            break
        case 'auditor':
            // TODO:register trainer seek
            registerAuditor(req,res)
            break
        default:
            break
    }
}

/**
 * register auditor
 * @param req
 * @param res
 */
const registerAuditor=(req,res)=>{
    console.log(req.body)
    Auditor.find({auditorEmail:req.body.user_email}, (err, auditors) =>{
        if(err){
            console.log(err)
            return res.send('-2') // server err
        }

        if(auditors[0]){
            return res.send('1') // auditor already exists
        }else{
            // can register
            let auditor=new Auditor({
                auditorEmail:req.body.user_email,
                auditorPassword:req.body.user_password,
                auditorCellphone:req.body.user_cellphone_number,
                UUID:uuidv4()
            })

            auditor.save().then(()=>{
                return res.send('0')
            })

        }
    })
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
            return res.send('1') // trainer already exists
        }else{
            // can register
            let trainer=new Trainer({
                trainerEmail:req.body.user_email,
                trainerPassword:req.body.user_password,
                trainerCellphone:req.body.user_cellphone_number,
                UUID:uuidv4()
            })

            trainer.save().then(()=>{
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

/**
 * register trainer seeker
 * @param req
 * @param res
 */
const registerTrainerSeeker=(req,res)=>{
    console.log(req.body)
    Trainer_seeker.find({trainer_seeker_email:req.body.user_email}, (err, trainer_seekers) =>{
        if(err){
            console.log(err)
            return res.send('-2') // server err
        }
        if(trainer_seekers[0]){
            return res.send('1') // trainer seeker already exists
        }else{
            // can register
            let trainer_seeker=new Trainer_seeker({
                trainer_seeker_email:req.body.user_email,
                trainer_seeker_password:req.body.user_password,
                trainer_seeker_cellphone:req.body.user_cellphone_number,
                UUID:uuidv4()
            })

            trainer_seeker.save().then(()=>{
                return res.send('0')
            })
        }
    })
}


module.exports.handleLogin=(req, res, next)=>{
    const {user_email, user_password, user_account_type}=req.body

    switch (user_account_type){
        case 'Trainer':
            // find user in Trainer DB
            findTrainerByEmailAndPassword(req,res)
            break
        case 'Trainer Seeker':
            // find user in Trainer Seeker DB
            findTrainerSeekerByEmailAndPassword(req,res)
            break
        case 'Auditor':
            // find user in Auditor DB
            findAuditorByEmailAndPassword(req,res)
            break
        case 'Admin':
            // TODO: find user in Admin DB
            console.log('look for admin')
            break
        default:
            break
    }
}

/**
 * find the auditor by email and password
 * @param req
 * @param res
 */
const findAuditorByEmailAndPassword=(req,res)=>{
    Auditor.find({
        auditorEmail: req.body.user_email,
        auditorPassword:req.body.user_password
    }, (err, auditors) =>{
        if(err){
            return res.send('-2') // server error
        }else if(!auditors[0]){
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
 * find the trainer by email and password
 * @param req
 * @param res
 */
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
 * find the trainer seeker by email and password
 * @param req
 * @param res
 */
const findTrainerSeekerByEmailAndPassword=(req,res)=>{
    Trainer_seeker.find({
        trainer_seeker_email: req.body.user_email,
        trainer_seeker_password:req.body.user_password
    }, (err, trainer_seekers) =>{
        if(err){
            return res.send('-2') // server error
        }else if(!trainer_seekers[0]){
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
            findTrainerSeekerByEmail(req,res)
            break
        case 'Auditor':
            // find from Auditor DB
            findAuditorByEmail(req,res)
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
const findAuditorByEmail=(req, res)=>{
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    Auditor.find({auditorEmail:req.query.user_email}, (err, auditors)=>{
        if(err){
            return res.send('-2') // server error
        }else if(!auditors[0]){
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
                    '<p><a href="http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+auditors[0].UUID+'">http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+auditors[0].UUID+'</a>'
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
 * find trainer seeker by email
 * @param req
 * @param res
 */
const findTrainerSeekerByEmail=(req, res)=>{
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    Trainer_seeker.find({trainer_seeker_email:req.query.user_email}, (err, trainer_seekers)=>{
        if(err){
            return res.send('-2') // server error
        }else if(!trainer_seekers[0]){
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
                    '<p><a href="http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+trainer_seekers[0].UUID+'">http://localhost:3000/recoverPassword?accountType='+req.query.user_account_type+'&UUID='+trainer_seekers[0].UUID+'</a>'
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
    const userInfo={}
    console.log(req.query.accountType)
    res.render('resetPasswordView', {
        title:'Reset password',
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
            findTrainerSeekerByUUID(req,res)
            break;
        case 'Auditor':
            // find this user in Auditor DB by UUID
            findAuditorByUUID(req,res)
            break;
        case 'Admin':
            // TODO: find this user in Admin DB by UUID
            break;
        default:
            break
    }
}

/**
 * find the trainer by UUID
 * @param req
 * @param res
 */
const findAuditorByUUID = (req,res)=>{
    Auditor.findOneAndUpdate({UUID: req.body.UUID}, {
        $set:{
            auditorPassword:req.body.new_password
        }
    }, {},(err, auditor) => {
        if(err){
            // -2: server error
            return res.send('-2')
        }
        if(!auditor){
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
 * find the trainer by UUID
 * @param req
 * @param res
 */
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
 * find the trainer seeker by UUID
 * @param req
 * @param res
 */
const findTrainerSeekerByUUID = (req,res)=>{
    Trainer_seeker.findOneAndUpdate({UUID: req.body.UUID}, {
        $set:{
            trainer_seeker_password:req.body.new_password
        }
    }, {},(err, trainer_seeker) => {
        console.log(trainer_seeker)
        if(err){
            // -2: server error
            return res.send('-2')
        }
        if(!trainer_seeker){
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


//renders the seeker home page
//send to seeker locations - steve
module.exports.renderSeekerHome = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    if(userInfo.user_email == null && userInfo.user_password == null)
    {
        res.render('/login');
    }
    res.render('homePages/seekerHome', { title : req.session.user_email, userInfo: userInfo });
}

module.exports.renderTrainerHome = (req, res, next) => {
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }
    if(userInfo.user_email == null && userInfo.user_password == null)
    {
        res.render('/login');
    }
    res.render('homePages/trainerHome', { title : req.session.user_email, userInfo: userInfo });
}

