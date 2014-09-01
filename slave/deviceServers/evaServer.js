var arg =  process.argv;
var x = arg.shift();
x = arg.shift();
console.log("dskhskjhfkjsdhfkjdshgk ", arg);
var fs = require('fs');
var ev3 = require('ev3dev');
var motorA = new ev3.Motor(ev3.MotorPort.A);
var head = new ev3.Motor(ev3.MotorPort.C);
console.log("-----hope this works -----", head.position);


//head.startMotor({
//  targetSpeed: arg[0],
//  time: 500,
  //stopMode: 'hold'
//});
console.log("----started head---");

function step() {
  setTimeout(function() {
    console.log("--started leg--", arg[1]);  
    motorA.startMotor({
      targetSpeed: arg[1],
      time: 1500,
      //stopMode: 'hold'
    });
  }, 1500);

  setTimeout(function() {
    console.log("--started leg--", -arg[1]);
    motorA.startMotor({
      targetSpeed: -arg[1],
      time: 1500,
      //stopMode: 'hold'
    });
  }, 3000);
  setTimeout(step, 4500);
}
step();

//open file /sys/class/msensor/sensor1/value0 -- touch sensor
var file =fs.readFileSync("/sys/class/msensor/sensor0/value0");
console.log("file is--- ", JSON.parse(file));
