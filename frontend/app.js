//working with predefined tags led1 and led2
var tags = ["led1", "led2"];


function app(){
console.log("in app()")
  setTags(function(err) {
    if (err) {
      console.log("Error in setTags: ", err);
      return;
    }
    queryTags(['led1', 'led2'], function(tags, err) {
      console.log("in query tags i receive tags", tags, " error is : ", err);
      readTags(tags, function (tagsData) {
        console.log("readTags passes result : ", tagsData);
        turnOffLigths(tags, function(lightsData) {
          console.log("turnOfLights receives lightdata : ", lightsData);
          readTags(tags, function(){console.log("ZARAZA");});
        });
      });
    });
  });


  queryTags(tags, function(x){
    console.log("X is ", x);
    listTags(x, setup);});

};

function listTags(links, cb){
  console.log("LINKS ARE ", links);
  console.log("my links for this tags are ", links);
    for (var key in links) {
      console.log(key, " val ", links[key]);
      $('<a>',{
        text: " " + key + " \n",
        title: key,
        href: links[key]["url"]
      }).appendTo('body');
    console.log("MUAHAHAHAH ", links[key]["url"]);
    }
    cb(links);

}
function setup() {
  //- ROT.readTag("tag", function cb(resp, err) { ... } ) => resp: WHATEVER THE URLS OF THAT TAG RETURNS
  //- ROT.writeTag("tag", data, cb(resp, err) { ... } ) => data: whatever data you want, resp: tag will respond whatever it wants
  //button that if off
  //led1 and led 2

  console.log("I AM IN SETUP ");
  var pushMe = $('<button/>',
    {
      text: 'PushMe',
      click: function () { console.log('hi');
          readTag("led1", function(state) {
          if (state === "on") {
            console.log("I SET TAG for led ON");
            writeTag("led1", "off", function(){console.log("WROTE TAG");});
          } else {
            console.log("I SET TAG for led OFF and state is BLABABLABALBA", state, "length is ", state.length);
            writeTag("led1", "on", function(x){console.log("WROTE TAG ", x);  });
          }
        });

          readTag("led2", function(state) {
          if (state === "on") {
            writeTag("led2", "off", function(){console.log("LED2 YYYYYY");});
          } else {
            writeTag("led2", "on", function(){console.log("LED2 XXXXXX");});
          }
        });
        readTags(['led1', 'led2'], function(tags){console.log("LIFE  tags are", tags);});
        queryTags(['led1', 'led2'], function(data){console.log("*************** ",data);})
        readTag('led1', function(x){console.log("read tag for led1",x);});
      }});
  $("body").append(pushMe);

}


function forEach(obj, cb) {
  for (var e in obj) {
    cb(e);
  }
}

function readTags(tags, cb) {
  console.log("i am in readTags   @#$%^&*^%$#@!~@#$%^& ");
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
  console.log("i am in turnOffLigths   @#$%^&*^%$#@!~@#$%^& ");
  var readValues = {};
  forEach(tags, function(tag) {
    console.log("tag : ", tag);
    writeTag(tag, "on", function(data, err) {
      readValues[tag] = data;
      console.log("i read the tag value for tag", tag, " data is: ", data);
      if (err)
        console.log("Error from readTag: ", err);
      if (Object.keys(readValues).length === Object.keys(tags).length)
        cb(readValues);
    });
  });
}

var feature1 = 'gigagator-ultra-leds-inqqpa2';
var feature2 = 'factory-name-for-led1-C00FF33';

function setTags(cb) {
    // exports.setTag = function setTag(uuid, feature, tagName, cb) {
    console.log("in setTags");
  setTag('uuid1', "factory-name-for-led1-C00FF33", 'led1', function(err) {
    console.log("in setTag1 cb");
    if (err) {
      cb(err);
      return;
    }
    setTag('uuid2', "gigagator-ultra-leds-inqqpa2", 'led2', cb);
  });
}


init(app);
