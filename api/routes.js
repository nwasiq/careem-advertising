'use strict';
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = function (app){

    var controller = require('./controller');

    app.route('/register')
     .post(controller.register);

    app.route('/login')
     .post(controller.login);

  app.route('/getallads')
    .get(controller.getAllAds);

  app.route('/deleteallads')
    .get(controller.deleteAllAds);

    app.route('/add-ad')
     .post(passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
      }), controller.uploadVideo);

    app.route('/get-ads')
      .get(passport.authenticate('jwt', {
         failureRedirect: '/authfailurejson',
         session: false
       }), controller.getAds);

    app.route('/delete-ads')
      .get(passport.authenticate('jwt', {
         failureRedirect: '/authfailurejson',
         session: false
       }), controller.deleteAds);

     app.get('/authfailurejson', function (req, res) {
        res.json({
          success: false,
          message: 'authorization failed'
        });
      });
    
}