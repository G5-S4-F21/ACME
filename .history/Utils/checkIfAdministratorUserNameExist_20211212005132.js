"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
    
  //refer to administrator DB
  const AdministratorModel=require('../models/administrator')
  const Administrator=AdministratorModel.Administrator
  
  
async function checkIfAdministratorNameIsTaken(req) {
  
let username = req.body.username;
let result = false;

return new Promise((res, rej) => {
    AdministratorModel.default.find({username:username}, (err, administrators)=>{ 
        
        if(!administrators[0])
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
exports.checkIfAdministratorNameIsTaken = checkIfAdministratorNameIsTaken;
//# sourceMappingURL=checkIfAdministratorNameIsTaken.js.map