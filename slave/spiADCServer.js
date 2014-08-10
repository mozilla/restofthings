var Mcp3008 = require('mcp3008.js'),
  adc = new Mcp3008(),
  channel = 0;

function readADC() {
  adc.read(channel, function (value) {
    console.log("value is----", value);
  });
};
setInterval(function(){readADC();},3000);