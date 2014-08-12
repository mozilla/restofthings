/**
 * setup:
 * query tags: - motion sensor to know if somebody is at the door
 *             - camera to visualise who's at your door
 *             - sound to notify when somebody/something is at the door
 */
function app(){
  console.log("-----in app------");
  queryTags(['cam', 'motion', 'sound', 'openButton'], function(tags, err) {
    console.log("query tags response is: ", tags);
    setInterval(monitorDoor,3000);
    //monitorDoor();
    var pushMe = $('<button/>',{
        text: 'OpenDoor',
        click: function () {
          console.log('hi');
          writeTag("openButton", "open", function (data) {
            console.log("received this data as feedback from openButton", data);
          });
        }
        }).addClass("btn btn-success");
    $("#myDiv").append(pushMe);
  });
};

function monitorDoor(){
  console.log("-----in monitor door-----");
  readTag('motion', function(data){
    console.log("data form motion sensor is", data);
    if (data === "1"){
      console.log("got something at the door");
      readTag('cam', function(data){
        console.log("camera gives me this data--", data);
        $('#myPic').attr('src', data);
        writeTag('sound', 'Leprechaun at the door!', function(resp){
          console.log("got this response --", resp);
        });
      })
    } else {
      $('#myPic').attr('src', "maxresdefault.jpg");
    }
  });
}

init(app);