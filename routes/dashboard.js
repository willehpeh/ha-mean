var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var config = require('../config/config');

// Authentication middleware
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.render('login', {errorMessage: 'Token expiré. Merci de vous identifier.' });
      } else {
        req.body.token = token;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.render('login', {errorMessage: "Merci de vous identifier."});
  }
});

// GET dashboard page
router.get('/', function(req, res) {
  res.render('dashboard', {title: "Dashboard"});
});

module.exports = router;
