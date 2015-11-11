var express = require('express');
var router = express.Router();
var pg = require('pg');
var connString = ('postgres://@localhost/fish_types')
var client = new pg.Client(connString)

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fish = [];
  pg.connect(connString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("SELECT * FROM fish");
    query.on('row', function(row) {
      fish.push(row);
    });
    query.on('end', function() {
      done();
      res.render('fish/index', {fishes: fish});
    });
  });
});

router.get('/new', function(req, res, next) {
  res.render('fish/new')
})

router.post('/', function(req, res, next) {
  pg.connect(connString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("INSERT INTO fish(family, species) VALUES ($1, $2) returning id", [req.body.family, req.body.species])
    query.on('end', function(result) {
      console.log(result);
      done();
      res.redirect('/fish');
    });
  });
});

module.exports = router;
