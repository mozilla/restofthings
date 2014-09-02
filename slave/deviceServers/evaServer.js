var arg =  process.argv;
arg.shift();
arg.shift();
console.log(" speed set to -----", arg);

var fs = require('fs');
var express = require('express');
var getRawBody = require('raw-body');
var cors = require('cors');
var request = require('superagent');

var ev3 = require('ev3dev');
var motorA = new ev3.Motor(ev3.MotorPort.A);
var head = new ev3.Motor(ev3.MotorPort.C);
console.log("-----head position -----", head.position);
console.log("-----legs position-----", motorA.position);

if (arg.length !== 2){
  console.log("got no particular speed specified");
  arg[0] = 50;
  arg[1] = 80;
  console.log("arguments will be ", arg);
}

var s = -1;
var count = 0;
function step() {
  count+=1;
  if (count > 20) {
    console.log("count is --", count);
    clearInterval(run);
  }
  s = s * -1;
  var pos = s * arg[1];
  console.log("--started leg--", pos);
  console.log("motor A firs position **********", motorA.position);

  head.startMotor({
    targetSpeed: arg[0] * s,
    regulationMode: true,
    time: 200,
    //stopMode: 'hold'
  });

  console.log("motor head position **********", head.position);

  setTimeout(function () {
      motorA.startMotor({
        targetSpeed: pos,
        time: 1500
      });

      console.log("motor A second position **********", motorA.position);
    }
  , 200);
}
var run = 0;
run = setInterval(step, 2500);
var  port = 7777;
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

app.put("/", function(req, res){
  if (req.text === "ping") {
    console.log("Hello human. I am EVA");
  }
  if (req.text === "start") {
    run = setInterval(step, 2500);
  }
  if (req.text === "stop") {
    clearInterval(run);
  }
});

app.listen(port);
