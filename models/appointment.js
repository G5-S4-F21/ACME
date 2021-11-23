'use.strict'
let mongoose = require('mongoose');

let Appointment = mongoose.Schema
(
    {
        //add the elements here
        ApptTrainer : 
        {
            type: String,
            default: '',
            trim: true,
            required: 'Trainer is required'
        },
        ApptSeeker: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'Seeker is required'
        },
        ApptDate: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'date is required'
        },
        ApptLoc: 
        {
            type: String,
            default: '',
            trim: true,
        },
        ApptTime:
        {
            type: String,
            default: '',
            trim: true
        }
    }
);

// export for the appointment profile

module.exports.Appointment = mongoose.model('Appointment', Appointment);