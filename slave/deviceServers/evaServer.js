var ev3 = require('ev3dev');
//Create the motor on port A
var motorA = new ev3.Motor(ev3.MotorPort.A);

//Run the motor at 60% power for five seconds, and then hold it in place
motorA.startMotor({
  targetSpeed: 40,
  time: 5000,
  stopMode: 'hold'
});

ev3.button.escape.on('press', function () {
  console.log("press");
});

ev3.button.escape.on('release', function () {
  console.log("release");
});