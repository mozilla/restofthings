/**
 * Created by rpodiuc on 8/19/14.
 */
var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var request = require('superagent');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

var argv = process.argv;
var port = argv[2];
if (port === undefined)
  port = 7777;
console.log("listening on port: ", port);
var app = express();


//handle post/put
app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf8'
  }, function (err, string) {
    if (err)
      return next(err);
    req.text = string;
    next();
  })
});

app.use(cors());

app.put(/up$/, function(req, res){
  client.up(req.text);
});

app.put(/down$/, function(req, res){
  client.down(req.text);
});
app.put(/start$/, function(req, res){
  client.takeoff();
});
app.put(/stop$/, function(req, res){
  client.land();
});



app.listen(port);


