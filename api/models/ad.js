'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var AdSchema = new schema({

    username: String,
    password: String,
    ad: [{
        brandName: String,
        videoLink: String,
        location: String
    }]
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