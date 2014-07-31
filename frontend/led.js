var gpio = require("pi-gpio");

function turnOnLeds(cb) {
  gpio.open(7, "output", function(err) {        // Open pin 7
    console.log("set ddr for led1");
    gpio.write(7, 1, function() {            // Set pin 7 high (1)
      console.log("led1/pin7 high")
      cb(7);
    });
  });
  gpio.open(11, "output", function(err) {        // Open pin 11 for output
    console.log("set ddr for led2");
    gpio.write(11, 1, function() {            // Set pin 11 high (1)
      console.log("led2/pin11 high");
      cb(11);
    });
  });
}


function readLedState(nr) {
  gpio.read(nr,  function(err, value) {
    if(err) throw err;
    console.log("on pin" +  nr + " I get this value " , value);    // The current state of the pin
    gpio.close(nr);

  });
}
turnOnLeds(readLedState);

function turnOffLeds() {
  gpio.open(7, "output", function(err) {        // Open pin 7
    console.log("set ddr for led1 second time");
    gpio.write(7, 0, function() {            // Set pin 7 low (0)
      console.log("led1/pin7 low");
      readLedState(7);
    });
  });
  gpio.open(11, "output", function(err) {        // Open pin 11 for output
    console.log("set ddr for led2 second time");
    gpio.write(11, 0, function() {            // Set pin 11 low (0)
      console.log("led2/pin11 low");
      readLedState(11);
    });
  });
}
setTimeout(turnOffLeds, 30000);
