var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = require('../app/models/project');
var User = require('../app/models/user');
var Post = require('../app/models/post');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs-extra');
var path = require('path');

// =============================================================================
//                                 HOME PAGE
// =============================================================================

router.route('/home')
  .get(function(req, res, next) {
    Project.find({
      front_page: true
    }, function(err, data) {
      if(err) {
        res.status(500).send(err);
      }
      res.send(data);
    });
  });

// =============================================================================
//                                 PROJECTS
// =============================================================================

// GET ALL PROJECTS, UN-AUTH
router.route('/projects')
  .get(function(req, res, next) {
    Project.find({
      $query: {},
      $orderby: {created_at: -1}
    }, function(err, data) {
      if(err) {
        res.send(500, err);
      }
      res.send(data);
    });
  })

  // CREATE NEW PROJECT, AUTH
  .post(function(req, res, next) {
    var project = new Project();
    var projectPhotos = [];
    if(
      !req.body.name ||
      !req.body.family ||
      !req.body.description
    ) {
       return res.render('error', {
        message : "Mandatory fields not completed.",
        error : {}
      });
    }
    project.name = req.body.name;
    project.family = req.body.family;
    project.description = req.body.description;
    if(req.body.partner) {
    project.partner = req.body.partner;
    }
    if(req.body.reference) {
      project.reference = req.body.reference;
    }
    if(req.body.news) {
      project.news = req.body.news;
    }
    if(req.body.front_page) {
    project.front_page = req.body.front_page;
    }
    if(req.body.front_page_order) {
    project.front_page_order = req.body.front_page_order;
    }
    if(req.body.date_started) {
    project.date_started = req.body.date_started;
    }
    if(req.body.date_completed) {
      project.date_completed = req.body.date_completed;
    }
    if(req.body.photo) {
      project.photos.push(req.body.photo);
    }
    if(!req.body.photo) {
      project.photos.push("/images/placeholder.jpg");
    }
    project.save(function(err, project) {
      if(err) {
        return res.send(500, err);
      }
      return res.send(project);
    });
  })

router.route('/projects/:id')

  // GET INDIVIDUAL PROJECT, UN-AUTH
  .get(function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
      if(err) {
        res.send(500, err);
      }
      res.send(project);
    });
  })
  // MODIFY PROJECT, AUTH
  .put(function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
      if(err) {
        res.send(500, err);
      }
      var projectPhotos = [];
      if(
        !req.body.name ||
        !req.body.family ||
        !req.body.description
      ) {
         return res.render('error', {
          message : "Mandatory fields not completed.",
          error : {}
        });
      }
      project.name = req.body.name;
      project.family = req.body.family;
      project.description = req.body.description;
      if(req.body.partner) {
        project.partner = req.body.partner;
      }
      if(req.body.reference) {
        project.reference = req.body.reference;
      }
      if(req.body.news) {
      project.news = req.body.news;
      }
      project.front_page = req.body.front_page;
      if(req.body.front_page_order) {
      project.front_page_order = req.body.front_page_order;
      }
      if(req.body.date_started) {
      project.date_started = req.body.date_started;
      }
      if(req.body.date_completed) {
        project.date_completed = req.body.date_completed;
      }
      if(req.body.photo) {
        project.photos.push(req.body.photo);
      }
      project.save(function(err, project) {
        if(err) {
          return res.send(500, err);
        }
        return res.send(project);
      });
    });
  })

  // DELETE PROJECT, AUTH
  .delete(function(req, res, next) {
    Project.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.status(500).send(err);
      }
      res.send("Project removed.")
    });
  });

// ADD IMAGE TO PROJECT, AUTH

router.route('/projects/:id/add-image')
  .post(multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    var uploadDate = new Date().toISOString();
    uploadDate = uploadDate.replace(/-/g, "");
    uploadDate = uploadDate.replace(/:/g, "");
    uploadDate = uploadDate.replace(/\./g, "");
    uploadDate = uploadDate.replace(/_/g, "");
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../public/images/uploads/" + uploadDate + file.name);
    var savePath = "/images/uploads/" + uploadDate + file.name;

    fs.rename(tempPath, targetPath, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      Project.findById(req.params.id, function(err, project) {
        if(err) {
          return res.status(500).send(err);
        }
        project.photos.push(savePath);
        project.save(function(err, project) {
          if(err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(project);
        });
      });
    });
  });

router.route('/projects/:id/rem-image/:photo')
  .post(function(req, res, next) {
    if(!req.params.id || !req.params.photo) {
      return res.status(400).send({message: "Bad request."});
    }
    var id = req.params.id;
    var photo = "";
    var toBeDeleted = true;

    if(req.params.photo === "placeholder.jpg") {
      photo = "/images/" + req.params.photo;
      toBeDeleted = false;
    } else {
      photo = "/images/uploads/" + req.params.photo;
    }

    Project.findById(id, function(err, project) {
      if(err) {
        return res.status(500).send(err);
      }

      var photoPositionInArray = project.photos.indexOf(photo);

      if(photoPositionInArray >= 0) {
        console.log("Photo is in position " + photoPositionInArray);
        project.photos.splice(photoPositionInArray, 1);
        console.log("Photo removed from array.");
        project.save(function(err, project) {
          if(err) {
            return res.status(500).send(err);
          }
          console.log("Project saved.");

          if(toBeDeleted) {
            var photoToDelete = path.join(__dirname, "../public" + photo);

            fs.remove(photoToDelete, function (err) {
              if(err) {
                return res.status(500).send(err);
              }
              console.log("Photo deleted.");
              return res.status(200).send({message: "Request complete."});
            });
          }
          else {
            return res.status(200).send({message: "Request complete."});
          }
        });
      }
      else {
        return res.status(500).send({message: "Could not find photo in array."});
      }
    });
  });

// =============================================================================
//                                   NEWS
// =============================================================================

router.route('/news')
  // GET ALL POSTS, UN-AUTH
  .get(function(req, res, next) {
    Post.find({
      $query: {},
      $orderby: {created_at: -1}
    }, function(err, data) {
      if(err) {
        res.send(500, err);
      }
      res.send(data);
    });
  })
  // CREATE NEW NEWS ITEM, AUTH
  .post(function(req, res, next) {
    var post = new Post();
    if(
      !req.body.title ||
      !req.body.text
    ) {
      return res.render('error', {
       message : "Mandatory fields not completed.",
       error : {}
     });
    }
    post.title = req.body.title;
    post.text = req.body.text;
    post.save(function(err, post) {
      if(err) {
        return res.send(500, err);
      }
      return res.send(post);
    });
  })

router.route('/news/:id')

  // GET INDIVIUAL NEWS ITEM, UN-AUTH
  .get(function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {
      if(err) {
        res.send(500, err);
      }
      res.send(post);
    });
  })

  // MODIFY NEWS ITEM, AUTH
  .put(function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {
      if(err) {
        res.send(500, err);
      }
      if(
        !req.body.title ||
        !req.body.text
      ) {
        return res.render('error', {
         message : "Mandatory fields not completed.",
         error : {}
       });
      }
      post.title = req.body.title;
      post.text = req.body.text;
      post.save(function(err, post) {
        if(err) {
          return res.send(500, err);
        }
        return res.send(post);
      });
    });
  })

  // DELETE NEWS ITEM, AUTH
  .delete(function(req, res, next) {
    Post.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.send(err);
      }
      res.send("Post removed.")
    });
  });

module.exports = router;
