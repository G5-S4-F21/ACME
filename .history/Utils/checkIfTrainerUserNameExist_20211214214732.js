"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
  // refer to trainer DB
  const TrainerModel=require('../models/tennisTrainer')
  const Trainer=TrainerModel.Trainer
  const trainer_1 = require('./trainer');
  const seeker_1 = require('./index');
  //refer to auditor DB
  const AuditorModel=require('../models/auditor')
  const Auditor=AuditorModel.Auditor
  
  //refer to administrator DB
  const AdministratorModel=require('../models/administrator')
  const Administrator=AdministratorModel.Administrator
  
  //refer to seeker DB
  const TrainerSeekerModel=require('../models/tennisTrainerSeeker')
  const TrainerSeeker=TrainerSeekerModel.Trainer
async function checkIfTrainerNameIsTaken(req) {
  
let username = req.body.username;
let result = false;

return new Promise((res, rej) => {
    TrainerModel.default.find({username:username}, (err, trainers)=>{ 
        
        if(!trainers[0])
        {
            res("false");
        }
        else
        {
            res("true");
        }
    });
})

    
}
exports.checkIfTrainerNameIsTaken = checkIfTrainerNameIsTaken;
