"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
   
  //refer to auditor DB
  const AuditorModel=require('../models/auditor')
  const Auditor=AuditorModel.Auditor
  
async function checkIfAuditorNameIsTaken(req) {
  
let username = req.body.username;
let result = false;

return new Promise((res, rej) => {
    AuditorModel.default.find({username:username}, (err, auditors)=>{ 
        
        if(!auditors[0])
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
exports.checkIfAuditorNameIsTaken = checkIfAuditorNameIsTaken;
