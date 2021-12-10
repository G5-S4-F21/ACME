let mongoose = require('mongoose');

let favorite = mongoose.Schema
(
    {
        TrainerId : 
        {
            type: String,
            default: '',
            trim: true,
            required: 'Trainer is required'
        },
    }
);

module.exports = mongoose.model('Favorite', favorite);