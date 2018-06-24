'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var AdsDbSchema = new schema({
    adLink: String,
    adArea: String
});

const adsDb = module.exports = mongoose.model('adsDb', AdsDbSchema );