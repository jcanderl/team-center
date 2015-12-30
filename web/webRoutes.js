var express = require('express');
var http = require('http');
var pg = require('pg');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var request = require('request');

var app = module.exports = express();

app.use(bodyParser.json({ type: 'application/json' }));
// We add the middleware after we load the body parser
app.use(expressValidator());

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/projects', function (req, res) {
    var apiURL = 'https://team-center2.herokuapp.com/v1/projects';
    request.get(apiURL, function(error,response,body){
           if(error){          
                 console.log('There was an error');
           }else{
                console.log(__dirname);
                var Results = JSON.parse(body); 
                res.render('pages/db', {results: Results} );
         }
});
});

/*
app.get('/projects', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM projects', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.render('pages/db', {results: result.rows} ); }
    });
  });
})
*/
