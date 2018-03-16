'use strict';
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = function (app){

    var controller = require('./controller');

    app.route('/register')
     .post(controller.register);

    app.route('/login')
     .post(controller.login);

    app.route('/add-ad')
     .post(passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
      }), controller.uploadVideo);

     app.get('/authfailurejson', function (req, res) {
        res.json({
          success: false,
          message: 'authorization failed'
        });
      });
    
}