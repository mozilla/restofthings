/**
 * setup:
 * query tags: - motion sensor to know if somebody is at the door
 *             - camera to visualise who's at your door
 *             - sound to notify when somebody/something is at the door
 */
function app(){
  console.log("-----in app------");
  queryTags(['light', 'buzzer'], function(tags, err) {
    console.log("query tags response is: ", tags);
    setInterval(monitorGarageDoor,7000);
    //monitorGarageDoor();
    var pushMe = $('<button/>',{
      id:"pushMe",
      text: 'CloseDoor',
      click: function () {
               writeTag("buzzer", "", function(data){
               console.log("wrote data to buzzer ", data);});
               change();
             }
    }).addClass("btn btn-success");
    $("#myDiv").append(pushMe);
  });
};


function change(text) // no ';' here
{
  console.log("---change got called---");
  var elem = document.getElementById("pushMe");

  if (text !== undefined) {
    elem.innerHTML = text;
    return;
  }
  if (elem.innerText  == "CloseDoor") {
    console.log("MUAHAHAH close door");
    elem.innerText = "OpenDoor";
  }
  else elem.innerText = "CloseDoor";

}

function monitorGarageDoor(){
  console.log("-----in monitor door-----");
  readTag('light', function(data){
    console.log("data form light sensor is----", data);
    console.log("type of data is -------", typeof(data));
    if (parseInt(data) > 900){
      alert("GARAGE OPEN!");
      change("CloseDoor");
      console.log("type of data is -------", typeof(parseInt(data)));
      console.log("------data is more than 900----");
    } else {
      change("OpenDoor");
    }
  });
}

init(app);
