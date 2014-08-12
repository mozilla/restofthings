var spawn = require('child_process').spawn;
var buzzer   = spawn('node', ["buzzerServer.js", "8888"]);
var speaker  = spawn('node', ["speakerServer.js", "3333"]);
var cam = spawn('node', ["cameraServer.js", "9999"]);
var proximity = spawn('node', ["proximityServer.js", "1111"]);
var server = spawn('node', ["server.js", "config.json"]);


