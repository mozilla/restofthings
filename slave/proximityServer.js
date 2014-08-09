var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var gpio = require("pi-gpio");

var argv = process.argv;
var port = argv[2];
var pin = argv[3];
if (pin == undefined)
  pin = 32;
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

function setDirection(pin){
  gpio.open(pin, "in", function(err) {
      console.log("---set direction to pin ", pin, " to input---");
      console.log("---error is ------:", err);
  });
}

function readProximityState(pin, res) {
  gpio.read(pin,  function(err, value) {
    if(err) throw err;
    console.log("on pin" +  nr + " state is: " , value);    // The current state of the pin
    var state = value;
    if (res != undefined) {
      console.log("send a response with led state:  ", value);
      if (res !== undefined) {
        if (state == 1) {
          res.send("something's there ^_^");
        } else {
          res.send("nothing detected");
        }
      }
    }
    //gpio.close(pin);
  });
}

app.get("/", function(req, res) {
  console.log("GET /,  led state is: ", ledState);
  readProximityState(pin, res);
})

function startReading(pin)
{
  setDirection(pin);
  while(1){
    console.log("-----------proximity sensor on--------------");
    readProximityState(pin);
  }
}

app.listen(port);
startReading(pin);
