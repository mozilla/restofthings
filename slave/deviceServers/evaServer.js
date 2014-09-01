var fs = require('fs');
var ev3 = require('ev3dev');
//Create the motor on port A
var motorA = new ev3.Motor(ev3.MotorPort.A);

//Run the motor at 60% power for five seconds, and then hold it in place
motorA.startMotor({
  targetSpeed: 40,
  time: 5000,
  stopMode: 'hold'
});


//open file /sys/class/msensor/sensor1/value0 -- touch sensor
var file =fs.readFileSync("/sys/class/msensor/sensor0/value0");
console.log("file is--- ", JSON.parse(file));