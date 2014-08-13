/**
 * setup:
 * query tags: - light sensor to know if garage open/light open in garage
 *             - buzzer to notify closing/opening door
 */

function app(){
  console.log("-----in app------");
  queryTags(['light', 'buzzer'], function(tags, err) {
    console.log("query tags response is: ", tags);
    setInterval(monitorGarageDoor,70000);
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
      change("CloseDoor");
      alert("GARAGE OPEN!");
    } else {
      change("OpenDoor");
    }
  });
}

init(app);
