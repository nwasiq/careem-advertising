'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var AdObjSchema = new schema({
    brandName: String,
    videoLink: String,
    location: String,
    id: Number
});

const adObj = module.exports = mongoose.model('adobj', AdObjSchema);