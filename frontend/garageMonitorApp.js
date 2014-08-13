/**
 * setup:
 * query tags: - motion sensor to know if somebody is at the door
 *             - camera to visualise who's at your door
 *             - sound to notify when somebody/something is at the door
 */
function app(){
  console.log("-----in app------");
  queryTags(['light', 'relay', 'buzzer'], function(tags, err) {
    console.log("query tags response is: ", tags);
    setInterval(monitorGarageDoor,3000);
    var pushMe = $('<button/>',{
      text: 'CloseDoor',
      click: function () {
        console.log('hi');
        if (this.text === 'CloseDoor') {
        writeTag("relay", "close", function (data) {
          console.log("received this data as feedback from openButton", data);
          writeTag("buzzer", "", function(data){
          console.log("wrote data to buzzer ", data);
          });
          this.text = 'OpenDoor';
        });
        } else {
          writeTag("relay", "open", function (data) {
            console.log("received this data as feedback from openButton", data);
            this.text = 'CloseDoor';
            writeTag("buzzer", "", function(data){
              console.log("wrote data to buzzer ", data);
            });
          });
        }
      }
    }).addClass("btn btn-success");
    $("#myDiv").append(pushMe);
  });
};

function monitorGarageDoor(){
  console.log("-----in monitor door-----");
  readTag('light', function(data){
    console.log("data form light sensor is", data);
    if (data < 900){
      console.log("got something at the door");
      readTag('relay', function(data){
        if (data === "open")
          alert('GARAGE OPEN!');
      })
    }
  });
}

init(app);
