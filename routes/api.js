var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = require('./app/models/project');
var User = require('./app/models/user');
var Post = require('./app/models/post');

// =============================================================================
//                                 PROJECTS
// =============================================================================
router.get('/projects', function(req, res, next) {
  // GET ALL PROJECTS, UN-AUTH
  Project.find({
    $query: {},
    $orderby: {created_at: -1}
  }, function(err, data) {
    if(err) {
      res.send(500, err);
    }
    res.send(data);
  });
});

router.route('/projects/:id')

  .get(function(req, res, next) {
// GET INDIVIDUAL PROJECT, UN-AUTH
  })

  .post(function(req, res, next) {
// CREATE NEW PROJECT, AUTH
  })

  .put(function(req, res, next) {
// MODIFY PROJECT, AUTH
  })

  .delete(function(req, res, next) {
// DELETE PROJECT, AUTH
  });

// =============================================================================
//                                   NEWS
// =============================================================================

router.get('/news', function(req, res, next) {
  // GET ALL POSTS, UN-AUTH
  Post.find({
    $query: {},
    $orderby: {created_at: -1}
  }, function(err, data) {
    if(err) {
      res.send(500, err);
    }
    res.send(data);
  });
});

router.route('/news/:id')
  .get(function(req, res, next) {
    // GET INDIVIUAL NEWS ITEM, UN-AUTH
  })
  .post(function(req, res, next) {
// CREATE NEW NEWS ITEM, AUTH
  })

  .put(function(req, res, next) {
// MODIFY NEWS ITEM, AUTH
  })

  .delete(function(req, res, next) {
// DELETE NEWS ITEM, AUTH
  });

module.exports = router;
