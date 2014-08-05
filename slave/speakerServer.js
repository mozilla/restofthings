var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var request = require("superagent");
var argv = process.argv;
var app = express();
var port = argv[2];

//handle put
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

app.post("/", function(req, res, next) {
  var text = req.text;
  console.log("POST  /, text is : ", text);
  require('child_process').spawn('node', ["textToSpeech.js", text]);
  res.send("text processed is " + text);
});

app.listen(port);
