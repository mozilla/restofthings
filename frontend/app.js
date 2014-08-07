//working with predefined tags led1 and led2
//var tags = ["led1", "led2"];

function app(){
  console.log("in app()");
    queryTags(['led1', 'led2'], function(tags, err) {
      listExistingTags(tags, setup);
    });
};

function listExistingTags(links, cb){
  console.log("LINKS is ---------: ", links);
  for (var key in links) {
    if (links[key] !== undefined)
      $('<a>',{
        text: " " +"http://" + JSON.parse(links[key]).url,
        title: key,
        href: "http://" + JSON.parse(links[key]).url
      }).appendTo('#'+ key);
  }
  cb(links);
}

function setup() {
  //- ROT.readTag("tag", function cb(resp, err) { ... } ) => resp: WHATEVER THE URLS OF THAT TAG RETURNS
  //- ROT.writeTag("tag", data, cb(resp, err) { ... } ) => data: whatever data you want, resp: tag will respond whatever it wants

  //test/set a new tag for raspberry-cam and use it as stream source
  setTag("uuid1", "raspberry-cam", 'cam', function(data) {
    console.log("just set a tag to the cam ...you should have an entry in /tmp/tags", data);
  });

  /*readTag('cam', function(data, err) {
    if (err)
      console.log("****************** I fail miserably to read url of my cam :(******************", err);
    console.log("**** |o/ ****************************data is ", data);
    var url = "http://" + data;
    console.log("APP url for camera ------------", url);
    loadImage(url);
  });*/
  var pushMe = $('<button/>',
    {
      text: 'ChangeState',
      click: function () { console.log('hi');
        readTag("led1", function(state) {
          console.log("state of led1 in readTAG is ", state);
          if (state === "on") {
            writeTag("led1", "off", function(){console.log("LED1 OFF");});
          } else {
            writeTag("led1", "on", function(){console.log("LED1 ON");  });
          }
        });

        readTag("led2", function(state) {
          if (state === "on") {
            writeTag("led2", "off", function(){console.log("LED2 OFF");});
          } else {
            writeTag("led2", "on", function(){console.log("LED2 ON");});
          }
        });

        //some test calls that will be removes as soon as this app is finished
        readTag('led1', function(data, err){console.log("read state of led1: ", data);});
        readTags(['led1', 'led2'], function(tags){console.log("tags are", tags);});
        queryTags(['led1'], function(data){console.log("queryTags ",data);})

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

function readTags(tags, cb) {
  console.log("I am in readTags tags: ------------------------", tags);
  var readValues = {};
  console.log("TAGS ARE ", tags);
  forEach(tags, function(tag) {
    console.log("tag: ", tag);
    readTag(tag, function(data, err) {
      readValues[tag] = data;
      if (err)
        console.log("Error from readTag: ", err);
      if (Object.keys(readValues).length === Object.keys(tags).length)
        cb(readValues);
    });
  });
}

init(app);
