'use strict';

const AdModel = require('./models/ad');
const AdsDb = require('./models/adsDb');
const fs = require('fs');  
const path = require('path');
const fileUpload = require('../utils/fileUpload');
const config = require('../config/database');
const baseURL = "http://192.168.0.105:3000";
const jwt = require('jsonwebtoken');
const serverAdsPath = './public/ads/';

//For firebase
var admin = require("firebase-admin");

var serviceAccount = require("/Users/nwasi/Desktop/Workspace/MEAN/careem-advertising/firebase-sdk.json");

var registrationTokenCareemApp = "c4YBYhHacYU:APA91bGlRNAX09zxGmAbDWSThKIVNr27tQOTZ8Des5P-1cFTGmWpeiu4gxhzwpKwN5jWdgmSphFT0TdfvCIM2Yo6S0hn6cGofdlrUGCdIH84twuBqJ0DoVM4wXOKI13yBBDfdOVgbznb";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://careem-81de0.firebaseio.com"
});

var topic = "careem";
var message = {
    data: {
        adLink: '',
      area: ''
    },
    topic: topic
    // token: registrationTokenCareemApp
  };
  

/////////////////////////////  

exports.getAds = function(req, res)
{
    AdModel.findOne(req.user._id, function(err, user){
        if(err) throw err;
        if(user.ad.length == 0){
            res.json({
                success: false,
                msg: "No ads found"
            });
            return;
        }
        res.json({
            success: true,
            ads: user.ad
        });
    });
}

exports.deleteAds = function(req, res)
{
    AdModel.findOne(req.user._id, function(err, user){
        if(err) throw err;
        
        fs.readdir(serverAdsPath, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(serverAdsPath, file), err => {
                if (err) throw err;
              });
            }

            user.ad = [];
            user.adCounter = 0;
            user.save(function(err){
                if(err) throw err;
                res.json({
                    success:true,
                    msg: "Ads cleared"
                });
            })
          });
    });
}

exports.uploadVideo = function(req, res)
{
    fileUpload.uploadAd(req, res, (err) => {
        const brandName = req.body.brandName;
        const location = req.body.location;

        if(err){
            res.json({
                success: false,
                msg: "upload failed",
                err: err
            });
        }
        else{
            if(req.file == undefined){
                res.json({
                  success: false,
                  msg: "no video selected"
                });
              } else{
                AdModel.findOne(req.user._id, function(err, user) {
                    user.adCounter += 1;
                    var adLink = baseURL + `/ads/${req.file.filename}`;
                    var advert = {
                        brandName: brandName,
                        videoLink: adLink,
                        location: location,
                        id: user.adCounter
                    }
                    user.ad.push(advert);
                    user.save(function(err, user){
                        if(err) throw err;
                        
                        message.data.adLink = advert.videoLink;
                        message.data.area = advert.location;
                        admin.messaging().send(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log('Dry run successful:', response);
                        })
                        .catch((error) => {
                            console.log('Error during dry run:', error);
                        });

                        var adsDbObj = new AdsDb({
                            adLink: advert.videoLink,
                            adArea: advert.location
                        });

                        adsDbObj.save(function(err, adDb){
                            if(err) throw err;
                            res.json({
                                success: true,
                                msg: "Advertisement added",
                                ad: advert
                            });
                        });

                        
                    });
                });
              }
        }

    });
}

exports.getAllAds = function(req, res){
    AdsDb.find({}, function(err, ads){
        if(err) throw err;
        if(ads.length == 0){
            res.json({
                success: false,
                msg: "No ads found"
            })
            return;
        }
        res.json({
            success:true,
            ads: ads
        })
    })
}

exports.deleteAllAds = function (req, res) {
    AdsDb.remove({}, function (err, ads) {
        if (err) throw err;
        res.json({
            success: true,
            msg: "All ads removed"
        })
    })
}

exports.login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    AdModel.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, msg: 'User not found' });
        return;
  
      }
  
      var isMatch;
  
      if(password == user.password)
         isMatch = true;
      else
         isMatch = false;
  
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });
  
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: user
        });
  
      }
      else {
        res.json({ success: false, msg: 'Wrong password' });
      }
    })
  }

  exports.register = function (req, res) {
    var newUser = new AdModel(req.body);
    var username = req.body.username;

    newUser.adCounter = 0;
  
    AdModel.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(user){
            res.json({
                success:false,
                msg: "a user with this username already exists"
            })
            return;
        }

        newUser.save(function (err, user) {

  
            if (err) {
              res.json({
                success: false,
                msg: "failed",
                error: err
              });
            }
            else {
              const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800 // 1 week
              });
              res.json({
                  success: true,
                  token: 'Bearer ' + token,
                  user: user
                });
            }
          });
    });
    
  }


