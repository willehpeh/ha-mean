var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = require('../app/models/project');
var User = require('../app/models/user');
var Post = require('../app/models/post');
var path = require('path');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: path.join(__dirname, "../public/images/tmp")});
var fs = require('fs-extra');
var nodemailer = require('nodemailer');


var config = require('../config/config');

var tokenMiddleware = function(req, res, next) {
  console.log(req.headers);
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        console.log("Token invalid.");
        return res.status(401).send({errorMessage: "Token expiré."});
      } else {
        console.log("Token valid, success!");
        req.body.token = token;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    console.log("No token.")
    return res.status(401).send({errorMessage: "Merci de vous identifier."});
  }
}

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
//                                 CONTACT FORM
// =============================================================================

router.route('/contact')
  .post(function(req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.email;
    var text = req.body.text;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dev.ha.architecture@gmail.com', // Your email id
            pass: '5namsyuH' // Your password
        }
    });
    var mailOptions = {
    from: address, // sender address
    to: 'huysmans@ha-architecture.fr', // list of receivers
    subject: 'Message de ' + name, // Subject line
    text: 'Nom : ' + name + '\n' +
          'Téléphone : ' + phone + '\n' +
          'Email : ' + address + '\n' +
          'Message : ' + '\n' +
          text
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
        console.log(error);
        res.json({yo: 'error'});
      } else {
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
      };
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
  .post(tokenMiddleware, function(req, res, next) {
    var project = new Project();

    project.name = req.body.name;
    project.family = req.body.family;
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
  .put(tokenMiddleware, function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
      if(err) {
        res.send(500, err);
      }
      project.name = req.body.name;
      project.family = req.body.family;
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
  .delete(tokenMiddleware, function(req, res, next) {
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

  // Delete image from project, AUTH

router.route('/projects/:id/rem-image/:photo')
  .delete(tokenMiddleware, function(req, res, next) {
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
  .post(tokenMiddleware, function(req, res, next) {
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
  .put(tokenMiddleware, function(req, res, next) {
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
  .delete(tokenMiddleware, function(req, res, next) {
    Post.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.send(err);
      }
      res.send("Post removed.")
    });
  });

// =============================================================================
//                                   USERS
// =============================================================================

router.route('/change-pw/:id')
  .put(tokenMiddleware, function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
      if(err) {
        res.send(500, err);
      }
      var oldPassword = req.body.oldPassword;
      var newPassword = req.body.newPassword;

      var oldPasswordHash = crypto
        .createHmac('sha256', config.secret)
        .update(oldPassword)
        .digest('hex');

      var newPasswordHash = crypto
        .createHmac('sha256', config.secret)
        .update(newPassword)
        .digest('hex');

      if(oldPasswordHash != user.password) {
        return res.status(401).send({success: false, message: "Le mot de passe actuel est incorrect."});
      }

      if(oldPasswordHash == user.password) {
        user.password = newPasswordHash;
        user.save(function(err, user) {
          if(err) {
            return res.status(500).send({success: false, message: "Database error."});
          }
          return res.status(200).send({success: true, message: "Mot de passe modifié."});
        });
      }

    });
  });

module.exports = router;
