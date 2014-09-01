var fs = require('fs');
var ev3 = require('ev3dev');
//Create the motor on port A
var motorA = new ev3.Motor(ev3.MotorPort.A);
var head = new ev3.Motor(ev3.MotorPort.C);
//Run the motor at 60% power for five seconds, and then hold it in place

//var tachoCountA = ev3.Motor.getTachoCount('A');
//console.log("tachoCount is ---- ", tachoCountA);
motorA.startMotor({
  targetSpeed: 40,
  time: 5000,
  stopMode: 'hold'
});
var speedA = ev3.Motor.getSpeed('A');
console.log("----speed A is", speedA);

//var tachoCountC = ev3.Motor.getTachoCount('C');
//console.log("tachoCount is ---- ", tachoCountC);

head.startMotor({
  targetSpeed: 50,
  time: 5000,
  stopMode: 'hold'
});

//var speedB = ev3.Motor.targetSpeed(C);
//console.log("----speed A is", speedC);


//open file /sys/class/msensor/sensor1/value0 -- touch sensor
var file =fs.readFileSync("/sys/class/msensor/sensor0/value0");
console.log("file is--- ", JSON.parse(file));