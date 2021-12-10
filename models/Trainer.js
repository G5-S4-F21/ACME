
// require modules for the User Model
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

const trainerSchema=mongoose.Schema
(
    {
        'trainerId': 
        {
            type :  Number,
            required : "is required",
            trim : true
        },
        'trainerEmail':
        {
            type : String,
            required : 'is required',
            trim: true
        },
        'trainerPassword':
        {
            type : String,
            required : 'is required',
            trim: true
        },
        'trainerCellphone':
        {
            type : String,
            trim : true
        },
        'trainerName':
        {
            type: String,
            default: 'anonymous trainer'
        },
        'trainerProvince':
        {
            type:  String,
            trim : true
        },
        'trainerCity':
        {
            type : String,
            trim : true
        },
        'trainerYearsOfTraining':
        {
            type : String,
            default : '',
            trim : true
        },
        'passAudit':
        {
            type : Boolean,
            required : "is required",
            default: false,
            trim : true
        },
        'UUID':
        {
            type : String,
            trim : true
        }
    },
    {
        collection : "trainers"
    }
)

// configure options for User Model

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
trainerSchema.plugin(passportLocalMongoose, options);

module.exports.Trainer = mongoose.model('Trainer', trainerSchema);
