
// require modules for the User Model
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

const auditorSchema=mongoose.Schema({
    'auditorId':Number,
    'auditorEmail': String,
    'auditorPassword':String,
    'auditorCellphone':String,
    'trainer_passed':[],
    'UUID':String
})

// configure options for User Model

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
auditorSchema.plugin(passportLocalMongoose, options);

module.exports.Auditor = mongoose.model('Auditor', auditorSchema);
