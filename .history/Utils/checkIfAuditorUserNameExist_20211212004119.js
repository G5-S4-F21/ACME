"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
   
  //refer to auditor DB
  const AuditorModel=require('../models/auditor')
  const Auditor=AuditorModel.Auditor
  
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
//# sourceMappingURL=checkIfTrainerNameIsTaken.js.map