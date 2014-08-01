//working with predefined tags led1 and led2
//var tags = ["led1", "led2"];

function app(){
  console.log("in app()");
    queryTags(['led1', 'led2'], function(tags, err) {
      listTags(tags, setup);


    });
};

function listTags(links, cb){
  for (var key in links) {
    console.log(key, " val ", links[key]);
    $('<a>',{
      text: " " + key + " \n",
      title: key,
      href: links[key]["url"]
    }).appendTo('body');
  }
  cb(links);
}

function setup() {
  //- ROT.readTag("tag", function cb(resp, err) { ... } ) => resp: WHATEVER THE URLS OF THAT TAG RETURNS
  //- ROT.writeTag("tag", data, cb(resp, err) { ... } ) => data: whatever data you want, resp: tag will respond whatever it wants
  //button that if off
  //led1 and led 2
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
        //setTag('uuid2', "gigagator-ultra-leds-inqqpa2", 'led4', function(data){
        //console.log("trying to set the tags ", data);});
        console.log("**********************at this step I fail*************************");
        setTag("uuid1", "raspberry-cam", 'cam', function(data) {
          console.log("just set a tag to the cam ...you should have an entry in /tmp/tags", data);
        });
        //console.log("~~~~~~~~~~~~~~~~~~", allTags['cam']);
        readTag('cam', function(data, err) {
          if (err)
            console.log("****************** I fail miserably ******************", err);
          console.log("**** |o/ ****************************data is ", data);
          var url = "http://" + data;
          loadImage(url);

        })
      }});
  $("body").append(pushMe);
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
  console.log("I am in readTags ");
  var readValues = {};
  console.log("TAGS ARE ", tags);
  forEach(tags, function(tag) {
    console.log("tag: ", tag);
    readTag(tag, function(data, err) {
      readValues[tag] = data;
      if (err)
        console.log("Error from readTag: ", err);
      if (Object.keys(readValues).length === Object.keys(tags).length)
        console.log("CB IS", cb);
        cb(readValues);
    });
  });
}

function turnOffLigths(tags, cb) {
  console.log("I am in turnOffLigths");
  var readValues = {};
  forEach(tags, function(tag) {
    console.log("tag : ", tag);
    writeTag(tag, "off", function(data, err) {
      readValues[tag] = data;
      console.log("I read the tag value for tag", tag, " data is: ", data);
      if (err)
        console.log("Error from readTag: ", err);
      if (Object.keys(readValues).length === Object.keys(tags).length)
        cb(readValues);
    });
  });
}


init(app);
