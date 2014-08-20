function app() {
  ROT.writeTag("ledDirection", "out",function(data) {
    console.log("---- write direction to led pin: ", data);
  });
  ROT.readTag("ledDirection", function(data) {
    console.log("---- read direction of led pin: ", data);
  });
  ROT.writeTag("ledValue", 1, function(data) {
    console.log("---- write tag ledValue: ", data);
  });
}
ROT.init(app);
