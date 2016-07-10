var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var dust = require('dustjs-helpers');
var pg = require('pg');

var app = express();

// DB Connection
var connect = "postgres://wynndigital:1234567@localhost/wynnrecipebookdb";

// Assign Dust Engine
app.engine('dust', consolidate.dust);

//Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  res.render('index');
})

//Server
app.listen(3000, function(){
  console.log('Server started on localhost:3000');
})
