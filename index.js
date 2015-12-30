var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var projectRoutes = require('./api/projectRoutes.js');
app.use(projectRoutes);

var website = require('./web/webRoutes.js');
app.use(website);

app.listen(app.get('port'), function() {
  console.log('Team Center is running on port', app.get('port'));
});
