
// require modules for the User Model
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

const trainerSchema=mongoose.Schema({
    'trainerId':Number,
    'trainerEmail': String,
    'trainerPassword':String,
    'trainerCellphone':String,
    'trainerName': {
        type:String,
        default: 'anonymous trainer',
    },
    'trainerYearsOfTraining': String,
    'passAudit':{
        type:Boolean,
        default: false
    },
})

// configure options for User Model

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
trainerSchema.plugin(passportLocalMongoose, options);

module.exports.Trainer = mongoose.model('Trainer', trainerSchema);
