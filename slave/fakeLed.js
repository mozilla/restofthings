var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var argv = process.argv;
var port = argv[2]

var app = express();
//handle post/put
app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf8'
  }, function (err, string) {
    if (err)
      return next(err)
    req.text = string
    next()
  })
})
app.use(cors());



var ledState = "off";

app.get("/", function(req, res) {
	console.log("GET /, fake led state is: ", ledState);
	res.json(ledState);
})

app.put("/", function(req, res, next) {
	console.log("PUT /, fake led state state is: ", ledState, " new value is: ", req.text);
	ledState = req.text;
	res.json(ledState);
})

app.listen(port);
