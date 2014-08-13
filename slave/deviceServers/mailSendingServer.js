var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var spawn = require('child_process').spawn;


var argv = process.argv;
var port = argv[2];
console.log("arguments are port", port);
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
app.get("/", function(req, res) {
  console.log("---------------GET /,  send email: -------");
  var  ssh   = spawn('ssh', ["ubuntu@ec2-54-185-133-18.us-west-2.compute.amazonaws.com", "node", "mailSender.js"]);
  res.send("------mail sent-----");
})


app.listen(port);