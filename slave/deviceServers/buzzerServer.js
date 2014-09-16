var http = require("http");
var url = require("url");
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var gpio = require("pi-gpio");

var argv = process.argv;
var port = argv[2];
if (port == undefined)
  port = 8888;
var pin = argv[3];
if (pin == undefined)
  pin = 12;
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

function sleep(millis, callback) {
  setTimeout(function()
    { callback(); }
    , millis);
}
function buzzerOff(){
  gpio.write(pin, 0, function(err, value) {
    if(err) throw err;
  })
}
function buzzerOn(){
  gpio.open(pin, "output", function(err) {        // Open pin 11
    console.log("set ddr for pin 12");
    //var val = 0; //default led state set to high
    gpio.write(pin, 261, function(err, value) {
      if(err) throw err;
    })
    sleep(3000, buzzerOff);
  })
}

buzzerOn();

app.get("/", function(req, res) {
  console.log("GET /,  buzzer ");
  buzzerOn();
  res.send("on");

})

app.post("/", function(req, res, next) {
  console.log("POST /, buzzer ");
  buzzerOn();
  res.send("on");
})

app.put("/", function(req, res, next) {
  console.log("PUT /,  buzzer ");
  buzzerOn();
  res.send("on");
})

app.listen(port);

