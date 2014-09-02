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

function step() {
  s = s * -1;
  var pos = s * arg[1];
  console.log("--started leg--", pos);
  console.log("motor A firs position **********", motorA.position);

  motorA.startMotor({
    targetSpeed: pos * -1,
    regulationMode: true,
    time: 1500
    //stopMode: 'hold'
  });

  console.log("motor head position **********", head.position);

  setTimeout(function () {
      head.startMotor({
        targetSpeed: arg[0] * s,
        time: 200
      });

      console.log("motor A second position **********", motorA.position);
    }
    , 1700);
  setTimeout(function () {
    motorA.startMotor({
      targetSpeed: pos,
      regulationMode: true,
      time: 1500
      //stopMode: 'hold'
    });

  }, 2700);
}
setInterval(step, 2500);

//open file /sys/class/msensor/sensor1/value0 -- touch sensor
var file =fs.readFileSync("/sys/class/msensor/sensor0/value0");
console.log("file is--- ", JSON.parse(file));
