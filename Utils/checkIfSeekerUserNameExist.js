"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
  
  //refer to seeker DB
  const TrainerSeekerModel=require('../models/tennisTrainerSeeker')
  const TrainerSeeker=TrainerSeekerModel.Trainer
async function checkIfSeekerNameIsTaken(req) {
  
let username = req.body.username;
let result = false;

return new Promise((res, rej) => {
    TrainerSeekerModel.default.find({username:username}, (err, seekers)=>{ 
        
        if(!seekers[0])
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
exports.checkIfSeekerNameIsTaken = checkIfSeekerNameIsTaken;
//# sourceMappingURL=checkIfSeekerNameIsTaken.js.map