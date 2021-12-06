
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
    'trainerProvince':String,
    'trainerCity':String,
    'trainerYearsOfTraining': {
        type:String,
        default: ''
    },
    'passAudit':{
        type:Boolean,
        default: false
    },
    trainer_appointment:[
        {
            'trainer_seeker': String,
            'date':String
        }
    ],
    'UUID':String
})

// configure options for User Model

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
trainerSchema.plugin(passportLocalMongoose, options);

module.exports.Trainer = mongoose.model('Trainer', trainerSchema);
