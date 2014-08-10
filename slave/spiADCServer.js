ADC = require ('adc-pi-spi');
options = {
  tolerance: 10,
  pollInterval: 200,
  channels: [0, 1, 2, 3]
}
adc=new ADC('/dev/spidev0.0', options);

adc.on ('change', function(channel, value){
  console.log('channel ', channel, 'is now', value);
  readValues();
});

process.on('SIGTERM', function() {
  adc.close();});

function readValues() {
  adc.read(0, function (data) {
    console.log("value is ----------------------", data);
  });
}

