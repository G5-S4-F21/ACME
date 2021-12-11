'use.strict'
const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//let passport = require('passport'),
//LocalStrategy = require('passport-local').Strategy;
let url = require('url');

// refer to trainer DB
const TrainerModel=require('../models/Trainer')
const Trainer=TrainerModel.Trainer

// refer to auditor DB
const AuditorModel=require('../models/Auditor')


const province_list = require("../public/resource/province");
const Auditor=AuditorModel.Auditor

/**
 * get all trainers
 * @param req
 * @param res
 * @param next
 */
module.exports.renderAllTrainersView = (req,res,next)=>{
    const userInfo={
        user_email:req.session.user_email,
        user_password:req.session.user_password,
        user_account_type:req.session.user_account_type
    }

    // get all trainers from trainers DB
    Trainer.find({certificateFilled:true}, (err, trainers) => {
        if(err){
            return res.send('-2') // server error
        }else{
            res.render('auditorViews/auditorGetAllTrainersView', {
                title:'All trainers',
                userInfo,
                trainers
            })
        }
    })
}

/**
 * pass or cancel audit
 * @param res
 * @param req
 * @param next
 */
module.exports.passAudit=(req, res, next)=>{
    const {trainer_id, trainer_pass_audit}=req.body
    console.log('trainer_pass_audit', trainer_pass_audit)

    // find the trainer by trainer id and set qualification to opposite
    Trainer.findOneAndUpdate({_id:trainer_id}, {
        $set:{
            passAudit:trainer_pass_audit === 'false'
        }
    }, (err, trainer)=>{
        if(err){
            // server error
            return res.send('-2')
        }else if(!trainer){
            // no such trainer in DB
            return res.send('0')
        }else{
            // reset passAudit to opposite
            return res.send('1')
        }
    })
}
