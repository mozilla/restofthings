//working with predefined tags led1 and led2
//tagging another feature to see if setTag works

function app(){
  console.log("-----in app------");
  ROT.queryTags(['led1', 'led2'], function(tags, err) {
    listExistingTags(tags, setup);
  });
};

function listExistingTags(links, cb){
  console.log("--------existing links  ---------: ", links);
  for (var key in links) {
    if (links[key] !== undefined)
      $('<a>',{
        text: " " + links[key],
        title: key,
        href: links[key]
      }).appendTo('#'+ key);
  }
  cb(links);
}

function setup() {
  ROT.setTag("uuid1", "raspberry-cam", 'cam', function(data) {
    console.log("just set a tag to the cam ...you should have an entry in /tmp/tags", data);
  });

  ROT.readTag('cam', function(data, err) {
    console.log("-----data read tag 'cam' |o/ ------------------------------", data);
    loadImage(data);
  });
  var pushMe = $('<button/>',
    {
      text: 'ChangeState',
      click: function () {
        console.log('hi');
        ROT.readTag("led1", function(state) {
          console.log("state of led1 in readTAG is ", state);
          if (state === "on") {
            writeTag("led1", "off", function(){console.log("LED1 OFF");});
          } else {
            writeTag("led1", "on", function(){console.log("LED1 ON");  });
          }
        });

        ROT.readTag("led2", function(state) {
          if (state === "on") {
            ROT.writeTag("led2", "off", function(){console.log("LED2 OFF");});
          } else {
            ROT.writeTag("led2", "on", function(){console.log("LED2 ON");});
          }
        });
      }}).addClass("btn btn-success");
  $("#myDiv").append(pushMe);
}
var camPic;
function loadImage(source) {
  camPic = new Image(640,480);
  camPic.src = source;
  $("#myPic").attr("src", camPic.src);
}

function forEach(obj, cb) {
  for (var e in obj) {
    cb(e);
  }
}

ROT.init(app);
