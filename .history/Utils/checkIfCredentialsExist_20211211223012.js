"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateIndex = void 0;
function checkIfUserNameIsTaken(req) {
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
    let indexes = ["1", "2", "3", "4", "5", "6"];
    let defaultIndex = 0;
    if (req.body.hourlyRate === "less than $50") {
        let user = req.user;
        return indexes[0];
    }
    else if (req.body.hourlyRate === "$50-$100") {
        return indexes[1];
    }
    else if (req.body.hourlyRate === "$100-$200") {
        return indexes[2];
    }
    else if (req.body.hourlyRate === "$200-$300") {
        return indexes[3];
    }
    else if (req.body.hourlyRate === "$300-$400") {
        return indexes[4];
    }
    else if (req.body.hourlyRate === "equal or greater than $400") {
        return indexes[5];
    }
    return indexes[defaultIndex];
}
exports.rateIndex = rateIndex;
//# sourceMappingURL=rateIndex.js.map