var ev3 = require('ev3');
var voltage = ev3.battery.getVoltage();
console.log("battery voltage--- ", voltage);
var speedA = ev3.Motor.getSpeed('A');
console.log("speed for motor A---", speedA);
