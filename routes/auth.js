var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var config = require('../config/config');

// Allow new users to sign up
router.route('/signup')
  .post(function(req, res, next) {

    // Retrieve username and password from request
    var username = req.body.username;
    var password = req.body.password;

    // Check if user already exists
    User.findOne({ name: username }, function(err, user) {
      if(err) {
        return res.status(500).send({success: false, message: "Database error."});
      }
      if(user) {
        return res.status(401).send({success: false, message: "User already exists."});
      }
      else {
        // Create new user
        var user = new User();
        user.name = username;

        // Create password hash and store to db
        var passwordHash = crypto
          .createHmac('sha256', config.secret)
          .update(password)
          .digest('hex');
        user.password = passwordHash;

        user.save(function(err, user) {
          if(err) {
            return res.status(500).send({success: false, message: "Database error."});
          }
        });

        // Create and serve token
        var token = jwt.sign(user, config.secret, {
          expiresIn: 3600 // expires in 60 minutes
        });
        return res.status(200).send({success: true, token: token, message: "Authentication successful."});
      }
    });
  });

router.route('/login')
  .get(function(req, res, next) {
    res.render('login', {title: "Login"});
  })
  .post(function(req, res, next) {

    // Retrieve username and password from request
    var username = req.body.username;
    var password = req.body.password;

    // Create password hash using secret key
    var passwordHash = crypto
      .createHmac('sha256', config.secret)
      .update(password)
      .digest('hex');

    // Attempt to authenticate user
    User.findOne({ name: username }, function(err, user) {
      if(err) {
        return res.status(500).send({success: false, message: "Database error."});
      }
      if(!user) {
        return res.status(401).send({success: false, message: "Invalid username."});
      }
      if(user.password != passwordHash) {
        return res.status(401).send({success: false, message: "Incorrect password."});
      }

      // Username and password correct, supply token
      if(user.password == passwordHash) {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 3600 // expires in 60 minutes
        });
        return res.status(200).send({success: true, token: token, message: "Authentication successful."});
      }
    });
  });

// ==================================================================================================

//                                ROUTE FOR TEST PURPOSES ONLY
//                                REMOVE FOR DEPLOYMENT

// ==================================================================================================

router.route('/checktoken')
  .post(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          return res.status(200).send({ success: true, token: decoded, message: "Token verified."});
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
  });

module.exports = router;
