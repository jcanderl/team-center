var express = require('express');
var http = require('http');
var projectRoutes = require('./api/projectRoutes.js');
var website = require('./web/webRoutes.js');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

app.use(bodyParser.json({ type: 'application/json' }));
// We add the middleware after we load the body parser
app.use(expressValidator());

app.set('port', (process.env.PORT || 5000));

app.use(projectRoutes);
app.use(website);

app.get('/test', function(req, res) {
request.get("http://localhost:5000/v1/projects",function(error,response,body){
           if(error){
                 console.log('There was an error');
           }else{
                 console.log('success');
               //  console.log(JSON.stringify(response.body));
                   res.send(response.body);
         }
});
});

app.listen(app.get('port'), function() {
  console.log('Team Center is running on port', app.get('port'));
});

// commit
