var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var request = require('superagent');

var argv = process.argv;
var port = argv[2];
if (port === undefined)
  port =  4545;
var webiopiUrl = "http://localhost:8000";

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

app.get(/GPIO\/[0-9]+\/(function|value)$/, function(req, res){
  console.log("path ", req.path);
  request
    .get(webiopiUrl + req.path)
    .end(function(res1){
      console.log("res is ", res1);
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

app.put(/GPIO\/[0-9]+\/(function|value|pulse|sequence|pulseRatio|pulseAngle)$/, function(req, res){
  console.log("received path: ", req.path);
  console.log("value to concatenate to url: ", req.text);
  console.log("constructed path ", webiopiUrl + req.path + "/" + req.text);
  request.post(webiopiUrl + req.path + "/" + req.text)
    .send()
    .end(function(res1) {
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

//TODO check whatever this does in webiopi api
app.get(/[a-z]*[A-Z]*[0-9]*$/, function(req, res) {

});

//HTTP POST /macros/(macro)/(args)
app.put(/macros\/[A-Z]*[0-9]*$/, function(req, res) {
  console.log("got this pathnamme", req.path);
  console.log("value to concat to url ", req.text);
  request.post(webiopiUrl + req.path + "/" + req.text)
    .send()
    .end(function(res1) {
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

//ADC
app.get(/devices/[A-Z]*[a-z]*/analog/[0-9]*[*]?/(integer|volt|float)$/, function(req, res) {
  console.log("got this pathnamme", req.path);
  console.log("value to concat to url ", req.text);
  request
    .get(webiopiUrl + req.path)
    .end(function(res1){
      console.log("res is ", res1);
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

app.get(/devices/[A-Z]*[a-z]*/analog\/(count|resolution|maximum|vref)$/, function(req, res) {
  console.log("got this pathnamme", req.path);
  console.log("value to concat to url ", req.text);
  request
    .get(webiopiUrl + req.path)
    .end(function(res1){
      console.log("res is ", res1);
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

//DAC
app.put(/devices\/[A-Z]*[0-9]*\/analog/[1-9]*/(integer|float|volt)$/, function(req, res) {
  console.log("got this pathnamme", req.path);
  console.log("value to concat to url ", req.text);
  request.post(webiopiUrl + req.path + "/" + req.text)
    .send()
    .end(function(res1) {
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

//PWM
app.get(/devices/[A-Z]*[a-z]*/pwm\/(count|resolution|maximum)$/, function(req, res) {
  console.log("got this pathnamme", req.path);
  console.log("value to concat to url ", req.text);
  request
    .get(webiopiUrl + req.path)
    .end(function(res1){
      console.log("res is ", res1);
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

app.put(/devices\/[a-z]*[0-9]*\/pwm/[1-9]*/(integer|float|angle|\*)$/, function(req, res) {
  console.log("got this pathnamme", req.path);
  console.log("value to concat to url ", req.text);
  request.post(webiopiUrl + req.path + "/" + req.text)
    .send()
    .end(function(res1) {
      if (res1.ok) {
        res.send(res1.text);
      } else {
        res.send("something went wrong");
      }
    });
});

app.listen(port);
