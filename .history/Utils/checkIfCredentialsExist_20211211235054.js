"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
  // refer to trainer DB
  const TrainerModel=require('../models/tennisTrainer')
  const Trainer=TrainerModel.Trainer
  const trainer_1 = require('../Utils/trainer');
  const seeker_1 = require('../Utils/index');
  //refer to auditor DB
  const AuditorModel=require('../models/auditor')
  const Auditor=AuditorModel.Auditor
  
  //refer to administrator DB
  const AdministratorModel=require('../models/administrator')
  const Administrator=AdministratorModel.Administrator
  
  //refer to auditor DB
  const TrainerSeekerModel=require('../models/tennisTrainerSeeker')
  const TrainerSeeker=TrainerSeekerModel.Trainer
function checkIfUserNameIsTaken(req) {
  
let username = req.body.username;
let result = false;
TrainerModel.default.find({username:username}, (err, trainers)=>{
    console.log("ceya");
    if(!trainers[0])
    {
        console.log("heya");
        return result; // no such user
    }
    else
    {
        result =true;
        return true;
    }
});
    
}
exports.checkIfUserNameIsTaken = checkIfUserNameIsTaken;
//# sourceMappingURL=checkIfUserNameIsTaken.js.map