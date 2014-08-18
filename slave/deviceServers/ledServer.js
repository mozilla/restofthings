var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var gpio = require("pi-gpio");

var argv = process.argv;
var port = argv[2];
if (port == undefined)
  port = 1234;
var pin = argv[3];
if (pin == undefined)
  pin = 11;
var app = express();
//led on pin 11

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

function setLed(nr){
  gpio.open(pin, "output", function(err) {        // Open pin 11
    console.log("set ddr for led1");
    //var val = 0; //default led state set to high
    gpio.write(pin, 1, function(err, value) {
      if(err) throw err;
      console.log("on pin" +  nr + " I get this value " , value);
      readLedState(pin);
    })
    //gpio.close(pin);
  })
}

setLed();

function readLedState(nr, res) {
  gpio.read(nr,  function(err, value) {
    if(err) throw err;
    console.log("on pin" +  nr + " state is: " , value);    // The current state of the pin
    ledState = value;
    if (res != undefined) {
      console.log("send a response with led state:  ", value);
      if (value == 1) {
        res.send("on");
      } else {
        res.send("off");
      }
    }
    //gpio.close(pin);
  });
}

function writeState(state, cb) {
  console.log("set ddr for led1");
  var val = 0;
  if (state == "on")
    val = 1;
  gpio.write(pin, val, function() {            // Set pin 11 high (1)
    console.log("led1/pin11 high ", val);
    //cb();
  });
}

app.get("/", function(req, res) {
  console.log("GET /,  led state is: ", ledState);
  readLedState(pin, res);
})


app.post("/", function(req, res, next) {
  console.log("POST /, led state is: ", ledState, " new value is: ", req.text);
  ledState = req.text;
  writeState(ledState, readLedState(pin, res));
})


app.put("/", function(req, res, next) {
  console.log("PUT /, led state is: ", ledState, " new value is: ", req.text);
  ledState = req.text;
  writeState(ledState, readLedState(pin, res));
})

app.listen(port);

var ledState = 0;
