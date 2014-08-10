/**
 * Created by rpodiuc on 8/9/14.
 */
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
  pin = 7;
console.log("arguments are port", port, " pin", pin);
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
  console.log("I am in set dirrection");
  gpio.open(pin, "input", function(err) {
    console.log("---set direction to pin ", pin, " to input---");
    console.log("---error is ------:", err);
    setInterval(function(){readLightState(pin);},3000);
    //gpio.setDirection(pin, "input" , function(){
    //console.log("-----i am in set dirrection------");
    //readLightState(pin, undefined);
    //});
  });
}

function readLightState(pin, res) {
  gpio.read(pin,  function(err, value) {
    console.log("READ pin------------------", pin, " value-----", value);
    if(err) throw err;
    console.log("on pin" +  pin + " state is: " , value);    // The current state of the pin
    var state = value;
    if (res !== undefined) {
      console.log("send a response with led state:  ", value);
      if (state == 1) {
        res.send("something's there ^_^");
      } else {
        res.send("nothing detected");
      }
    }
    return state;
    //gpio.close(pin);
  });
}

app.get("/", function(req, res) {
  console.log("GET /,  led state is: ", ledState);
  readLightState(pin, res);
})


app.listen(port);
setDirection(pin);
//startReading(pin);
