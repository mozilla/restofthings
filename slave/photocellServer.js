var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');

var argv = process.argv;
var port = argv[2];

if (port === undefined)
  port =  4444;

console.log("arguments are port", port);
var app = express();

var Mcp3008 = require('mcp3008.js'),
  adc = new Mcp3008(),
  channel = 0;

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

app.get("/", function(req, res) {

  console.log("GET /,  photocell state ");
  adc.read(channel, function (value) {
    console.log("light value is----", value);
    res.send(value);
  });
});

app.listen(port);
