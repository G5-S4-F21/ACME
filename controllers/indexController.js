const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let url = require('url');

//should render ../views/index.ejs//
module.exports.renderIndex = (req, res, next) => {
    res.render('index', { title: 'Tennis Assistant' });
}

