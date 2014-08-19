function app() {
  console.log("----got rotV2-----");
  ROT.writeTag("ledDirection", "out",function(data) {
    console.log("---- write direction to led pin: ", data);
  });
  ROT.readTag("ledDirection", function(data) {
    console.log("---- read direction of led pin: ", data);
  });
  ROT.writeTag("ledValue", function(data) {
    console.log("---- write tag dummy: ", data);
  });
}
ROT.init(app);
