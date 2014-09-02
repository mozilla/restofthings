var arg =  process.argv;
var x = arg.shift();
x = arg.shift();
console.log("dskhskjhfkjsdhfkjdshgk ", arg);
var fs = require('fs');
var ev3 = require('ev3dev');
var motorA = new ev3.Motor(ev3.MotorPort.A);
var head = new ev3.Motor(ev3.MotorPort.C);
console.log("-----head position -----", head.position);
console.log("-----hope this works type of motor-----", head.type);

var s = -1;
var count = 0;
function step() {
  count++;
  s = s * -1;
  var pos = s * arg[1];
  console.log("--started leg--", pos);
  console.log("motor A firs position **********", motorA.position);

  head.startMotor({
    targetSpeed: arg[0] * s,
    regulationMode: true,
    time: 200,
    stopMode: 'hold'
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
var run = setInterval(step, 2500);
if (count > 10) {
  console.log("count is --", count);
  clearInterval(run);
}