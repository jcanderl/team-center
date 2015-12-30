var express = require('express');
var request = require('request');

// Use module exports
var app = module.exports = express();

// Set the base url for API
var apiURL = 'https://team-center2.herokuapp.com/v1';

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Render Home Page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// Send request to API to get all projects
app.get('/projects', function (req, res) {
    request.get(apiURL+'/projects', function(error,response,body){
           if(error){          
                 console.log('There was an error');
           }else{
                var Results = JSON.parse(body); 
                res.render('pages/db', {results: Results} );
         }
});
});
