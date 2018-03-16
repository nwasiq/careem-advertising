'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = new schema({

    email: String,
    username: String,
    password: String

});

const User = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback)
{
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(name, callback)
{
    const query = {
        username: name
    };

    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback)
{
    const query = {
        email: email
    };

    User.findOne(query, callback);
}