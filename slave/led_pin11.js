var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var gpio = require("pi-gpio");

var argv = process.argv;
var port = argv[2]

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
  gpio.open(11, "output", function(err) {        // Open pin 7
    console.log("set ddr for led1");
    //var val = 0;
    gpio.write(11, 1, function(err, value) {
      if(err) throw err;
      console.log("on pin" +  nr + " I get this value " , value);
    })
    //gpio.close(11);
  })
}

setLed();
function readLedState(nr, res) {
  gpio.read(nr,  function(err, value) {
    if(err) throw err;
    console.log("on pin" +  nr + " I get this value " , value);    // The current state of the pin
    ledState = value;
    res.send(value);
    //gpio.close(11);
  });
}

function writeState(state, cb) {
  gpio.open(11, "output", function(err) {        // Open pin 7
    console.log("set ddr for led1");
    var val = 0;
    if (state == "on")
      val = 1;
    gpio.write(11, val, function() {            // Set pin 7 high (1)
      console.log("led1/pin11 high");
      cb(11);
    });
  });
}

app.get("/", function(req, res) {
  console.log("GET /,  led state is: ", ledState);
  //res.send(ledState);
  readLedState(11, res);
})

app.put("/", function(req, res, next) {
  console.log("PUT /, fake led state state is: ", ledState, " new value is: ", req.text);
  ledState = req.text;
  writeState(ledState, readLedState(11));
  //res.send(ledState);
})

app.listen(port);

var ledState = 0;
