
// require modules for the User Model
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let trainerSeekerSchema = mongoose.Schema
(
    {
        trainer_seeker_id :
        {
            type : Number,
            required : 'is required',
            trim : true
        },
        trainer_seeker_password:
        {
            type : String,
            required : 'is required',
            trim: true
        },
        trainer_seeker_email:
        {
            type: String,
            trim : true,
            required: 'is required'
        },
        trainer_seeker_cellphone:
        {
            type: String,
            default: '###-###-####',
            trim: true
        },
        trainer_seeker_name:
        {
            type : String,
            default : 'anonymous tennis seeker',
            trim: true
        },
        UUID: 
        {
            type: String,
            trim: true,
            required: "is required"
        }
    },
    {
        collection: "trainer_seekers"
    }
)

/*const trainerSeekerSchema=mongoose.Schema({
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
})*/

// configure options for User Model

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
trainerSeekerSchema.plugin(passportLocalMongoose, options);

module.exports.Trainer_seeker = mongoose.model('Trainer_seeker', trainerSeekerSchema);
