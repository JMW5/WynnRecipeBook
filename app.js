var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var dust = require('dustjs-helpers');
var pg = require('pg');

var app = express();

// DB Connection
var config = {
  user: 'wynndigital', //env var: PGUSER
  database: 'wynnrecipebookdb', //env var: PGDATABASE
  password: '1234567', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

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
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM recipes', function(err, result) {
    //call `done()` to release the client back to the pool

    if(err) {
      return console.error('error running query', err);
    }
    res.render('index', {recipes: result.rows})
    done();
    //output: 1
  });
});
});

app.post('/add', function(req, res) {
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query("INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)", [req.body.name, req.body.ingredients, req.body.directions]);
  done();
  res.redirect('/');
  });
});

app.delete('/delete/:id', function(req, res){
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query("DELETE FROM recipes WHERE id = $1", [req.params.id]);
  done();
  res.sendStatus(200);
  });
});

app.post('/edit', function(req, res){
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query("UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4", [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);
  done();
  res.redirect('/');
  });
});

//Server
app.listen(3000, function(){
  console.log('Server started on localhost:3000');
})
