var arg =  process.argv;
var x = arg.shift();
x = arg.shift();
console.log("dskhskjhfkjsdhfkjdshgk ", arg);
var fs = require('fs');
var ev3 = require('ev3dev');
var motorA = new ev3.Motor(ev3.MotorPort.A);
var head = new ev3.Motor(ev3.MotorPort.C);
console.log("-----hope this works -----", head.position);
console.log("-----hope this works type of motor-----", head.type);

var s = -1;


head.startMotor({
  targetSpeed: arg[0],
  regulationMode: true,
  time: 500
  //stopMode: 'hold'
});
console.log("----started head---");

function sleep(millis, callback) {
  setTimeout(function()
    { callback(); }
    , millis);
}

function step() {
  s = s * -1;
  var pos = s * arg[1];
//  setTimeout(function() {
    console.log("--started leg--", arg[1]);
    console.log("motor A firs position **********", motorA.position);
    motorA.startMotor({
      targetSpeed: pos,
      time: 1500,
      //stopMode: 'hold'
    });
    console.log("motor A second position **********", motorA.position);

//  }, 1500);
  //step();
  /*setTimeout(function() {
    console.log("--started leg--", -arg[1]);
    motorA.startMotor({
      targetSpeed: -arg[1],
      time: 1500,
      //stopMode: 'hold'
    });
  }, 3000);
  setTimeout(step, 4500);*/
}

setInterval(step, 2500);

//open file /sys/class/msensor/sensor1/value0 -- touch sensor
var file =fs.readFileSync("/sys/class/msensor/sensor0/value0");
console.log("file is--- ", JSON.parse(file));
