let mongoose = require('mongoose');

let AppointmentModel = mongoose.Schema
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
        },
        Confirmed:
        {
            type: Boolean,
            default: false
        }
    },
    {
        collection : "appointments"
    }
);

// export for the appointment profile

module.exports = mongoose.model('Appointment', AppointmentModel);