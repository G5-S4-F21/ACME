
// require modules for the User Model
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

const trainerSeekerSchema=mongoose.Schema({
    'trainer_seeker_id':Number,
    'trainer_seeker_email': String,
    'trainer_seeker_password':String,
    'trainer_seeker_cellphone':String,
    'trainer_seeker_name': {
        type:String,
        default: 'anonymous trainer',
    },
    trainer_seeker_appointment:[
        {
            'trainer': String,
            'date':String
        }
    ],
    'UUID':String
})

// configure options for User Model

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
trainerSeekerSchema.plugin(passportLocalMongoose, options);

module.exports.Trainer_seeker = mongoose.model('Trainer_seeker', trainerSeekerSchema);
