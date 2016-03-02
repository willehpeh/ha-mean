var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = require('../app/models/project');
var User = require('../app/models/user');
var Post = require('../app/models/post');
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: path.join(__dirname, "../public/images/tmp")});
var fs = require('fs-extra');

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
    Project.find(function(err, data) {
      if(err) {
        res.send(500, err);
      }
      res.send(data);
    });
  })

  // CREATE NEW PROJECT, AUTH
  .post(function(req, res, next) {
    var project = new Project();

    project.name = req.body.name;
    project.address = req.body.address;
    project.surface = req.body.surface;
    project.client = req.body.client;
    project.status = req.body.status;
    project.year = req.body.year;
    project.description = req.body.description;
    project.characteristics = req.body.characteristics;
    project.front_page = req.body.front_page;
    project.photos[0] = "/images/placeholder.jpg";
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
      project.name = req.body.name;
      project.address = req.body.address;
      project.surface = req.body.surface;
      project.client = req.body.client;
      project.status = req.body.status;
      project.year = req.body.year;
      project.description = req.body.description;
      project.characteristics = req.body.characteristics;
      project.front_page = req.body.front_page;
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
    file.name = file.name.replace(/\s/g, "");
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
    Post.find(function(err, data) {
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
