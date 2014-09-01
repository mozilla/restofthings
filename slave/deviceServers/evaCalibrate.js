/**
 * Created by rpodiuc on 9/1/14.
 */
var arg =  process.argv;
var x = arg.shift();
x = arg.shift();
console.log("speed ", arg);
var fs = require('fs');
var ev3 = require('ev3dev');
var head = new ev3.Motor(ev3.MotorPort.B);
console.log("-----hope this works -----", head.position);
console.log("-----hope this works type of motor-----", head.type);

head.runServo(0);
console.log("-----hope this works -----", head.position);
