var arg =  process.argv;
var x = arg.shift();
x = arg.shift();
console.log("dskhskjhfkjsdhfkjdshgk ", arg);
var fs = require('fs');
var ev3 = require('ev3dev');
//var ev32 = require('ev3');
//var voltage = ev32.battery.getVoltage();
//console.log("voltage is ", voltage);
var motorA = new ev3.Motor(ev3.MotorPort.A);
var head = new ev3.Motor(ev3.MotorPort.C);

head.startMotor({
  targetSpeed: arg[0],
  time: 4000,
//stopMode: 'hold'
});
console.log("----started head---");

setTimeout(function() {
  console.log("--started leg--");  
  motorA.startMotor({
      targetSpeed: arg[1],
      time: 4000,
//stopMode: 'hold'
    });
  }, 9000);

setTimeout(function() {
  console.log("--started leg--");
  motorA.startMotor({
      targetSpeed: -arg[1],
      time: 4000,
//stopMode: 'hold'
    });
  }, 18000);

//open file /sys/class/msensor/sensor1/value0 -- touch sensor
var file =fs.readFileSync("/sys/class/msensor/sensor0/value0");
console.log("file is--- ", JSON.parse(file));
