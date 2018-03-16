'use strict';

const AdModel = require('./models/ad');
const fileUpload = require('../utils/fileUpload');
const config = require('../config/database');
const baseURL = "http://localhost:3000";
const jwt = require('jsonwebtoken');

exports.getAds = function(req, res)
{
    AdModel.findOne(req.user._id, function(err, user){
        if(err) throw err;
        res.json({
            success: false,
            ads: user.ad
        });
    });
}

exports.deleteAds = function(req, res)
{
    AdModel.findOne(req.user._id, function(err, user){
        if(err) throw err;
        user.ad = [];
        user.save(function(err){
            if(err) throw err;
            res.json({
                success:true,
                msg: "Ads cleared"
            });
        })
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
                    var advert = {
                        brandName: brandName,
                        videoLink: baseURL + `/ads/${req.file.filename}`,
                        location: location,
                        id: user.adCounter
                    }
                    user.ad.push(advert);
                    user.save(function(err, user){
                        if(err) throw err;
                        res.json({
                            success:true,
                            msg: "Advertisement added",
                            ad: advert
                        });
                    });
                });
              }
        }

    });
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


