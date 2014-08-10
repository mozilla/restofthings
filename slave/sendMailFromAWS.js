var spawn = require('child_process').spawn;
var  ssh   = spawn('ssh', ["ubuntu@ec2-54-185-133-18.us-west-2.compute.amazonaws.com", "node", "mailSender.js"]);


