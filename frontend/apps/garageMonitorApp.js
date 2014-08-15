/**
 * setup:
 * query tags: - light sensor to know if garage open/light open in garage
 *             - buzzer to notify closing/opening door
 */

function app(){
  ROT.queryTags(['light', 'buzzer'], function(tags, err) {
    setInterval(monitorGarageDoor,7000);
    var pushMe = $('<button/>',{
      id:"pushMe",
      text: 'CloseDoor',
      click: function () {
               ROT.writeTag("buzzer", "", function(data){
               console.log("wrote data to buzzer ", data);});
               change();
             }
    }).addClass("btn btn-success");
    $("#myDiv").append(pushMe);
  });
};


function change(text) {
  var elem = document.getElementById("pushMe");
  if (text !== undefined) {
    elem.innerHTML = text;
    return;
  }
  if (elem.innerText  == "CloseDoor") {
    elem.innerText = "OpenDoor";
  } else {
    elem.innerText = "CloseDoor";
  }
}

function monitorGarageDoor() {
  ROT.readTag('light', function(data){
    if (parseInt(data) > 900){
      change("CloseDoor");
      alert("GARAGE OPEN!");
    } else {
      change("OpenDoor");
    }
  });
}

init(app);
