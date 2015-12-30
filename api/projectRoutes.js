var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// Use module exports 
var app = module.exports = express();

// Setup projectRouter
var projectRouter = express.Router();
app.use('/v1/projects', projectRouter);

/* MIDDLEWARE FUNCTIONS *******************************/

// LOOK UP PROJECT BY ID
function lookupProject(req, res, next) {
  var projectId = req.params.id;
  var sql = 'SELECT * FROM projects WHERE id = $1';
pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query(sql, [ projectId ], function(err, results) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: ['Could not retrieve project'] });
    }
    if (results.rows.length === 0) {
      res.statusCode = 404;
      return res.json({ errors: ['Project not found']});
    }
    req.project = results.rows[0];
    next();
  });
 });
}

// VALIDATE PROJECT
function validateProject(req, res, next) {
  req.checkBody('id', 'Invalid id').isNumeric();
  req.checkBody('name', 'Invalid name').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push(err.msg);
    });
    res.statusCode = 400;
    return res.json(response);
  }
  return next();
 }

/* PROJECT CRUD ***************************************/

// GET ALL PROJECTS
projectRouter.get('/', function(req, res) {
    var sql = 'SELECT * FROM projects'; 
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(sql, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
/*       { res.render('pages/db', {results: result.rows} ); } */
        res.statusCode = 201;
        res.json(result.rows);

    });
  });
});

// GET PROJECT BY ID
projectRouter.get('/:id([0-9]+)', lookupProject, function(req, res) {
  res.json(req.project);
});

// POST NEW PROJECT
projectRouter.post('/', validateProject, function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = "INSERT INTO projects (id, name) values ($1, $2) RETURNING id"; 
    var data = [
      req.body.id,
      req.body.name
    ];
    client.query(sql, data, function(err, result) {
      done();
      if (err) {
       console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not create project']
      }); }
      else {
        res.statusCode = 201;
        res.json(result.rows[0]);
      }
    });
  });
});


// DELETE PROJECT BY ID IN ROUTE
projectRouter.delete('/:id', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = "DELETE FROM projects WHERE id = $1 RETURNING id";
    var data = [
      req.params.id,
      ];
    client.query(sql, data, function(err, result) {
      done();
      if (err) {
       console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not delete project']
      }); }
      else {
        res.statusCode = 200;
        res.json(result.rows[0]);
      }
    });
  });  
});

// DELETE PROJECT BY ID IN JSON
projectRouter.delete('/', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = "DELETE FROM projects WHERE id = $1 RETURNING id";
    var data = [
      req.body.id,
      ];
    client.query(sql, data, function(err, result) {
      done();
      if (err) {
       console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not delete project']
      }); }
      else {
        res.statusCode = 200;
        res.json(result.rows[0]);
      }
    });
  });  
});
