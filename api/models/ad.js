'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

//this line registers a model in the schema 
var adObj = require('./adObj');

var adObjModel = mongoose.model('adobj').schema;

var AdSchema = new schema({

    username: String,
    password: String,
    adCounter: Number,
    ad: [ adObjModel ]
});

const ad = module.exports = mongoose.model('ad', AdSchema);

module.exports.getUserById = function(id, callback)
{
    ad.findById(id, callback);
}

module.exports.getUserByUsername = function(name, callback)
{
    const query = {
        username: name
    };

    ad.findOne(query, callback);
}