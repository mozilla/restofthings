var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
function generate(){
  var x = Math.random()* (255 - 0) + 0;;
  console.log("random value is", x);
  return x;
}
var argv = process.argv;
var port = argv.split(" ");

port.shift();
port.shift();

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

app.get("/", function(req, res) {
  var x =generate();
  console.log("random value between 0 and 255", x);
  res.json(x);
})

app.put(/^\/tags\/[A-z:.-]+$/, function(req, res, next) {
  var tagName = req.path.substr("/tags/".length);
  console.log('i am in put and i want to write a tag : ', tagName);
  state[tagName] = req.text;
  commit(function(err) {
    if (err)
      return next(err);
    res.send("OK");
  });
})
app.listen(6666);
