'use.strict'
let mongoose = require('mongoose');
//let passportLocalMongoose = require('passport-local-mongoose');

let Profile = mongoose.Schema
(
    {
        username: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'username is required'
        },
        
        greeting : 
        {
            type: String,
            default: 'Hello greeting from me',
            trim: true
        },
        skill: 
        {
            type: String,
            default: 'beginner tennis player',
            trim: true
        },
        athletic:
        {
            type: String,
            default: 'not that athletic',
            trim: true
        },
       slogan: 
       {
            type: String,
            default: 'tennis is my first love',
            trim: true,
       },
       favFood: 
       {
            type: String,
            default: 'tennis players eat anything',
            trim: true
       },
       favTennisPlayer: 
       {
            type: String,
            default: 'myself',
            trim: true
       },
       favMovie: 
       {
            type: String,
            default: 'tennis pro documentary',
            trim: true
       },
       UUIDid:
       {
           type: String,
           default : '',
           required : 'uuid is required',
           trim: true
       }
    },
    {
        collection: "profiles"
    }
);

let options = ({ missingPasswordError: 'Wrong / Missing Password'});
module.exports.Profile = mongoose.model('Profile', Profile);