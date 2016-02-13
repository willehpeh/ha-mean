var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Accueil' });
});

// GET news page
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Actualités' });
});

// GET agency page
router.get('/agency', function(req, res, next) {
  res.render('agency', { title: 'L\'Agence' });
});

// GET projects page
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projets' });
});

// Render Jade partials as HTML for Angular frontend
router.get('/partials/:name', function (req, res)
 { var name = req.params.name;
   res.render('partials/' + name);
});

module.exports = router;
