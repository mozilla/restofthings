(function(global) {

if (typeof superagent === 'undefined') {
    superagent = require('superagent');
}

var baseurl = "http://10.0.0.3:8080";

var allUuids = [];
var allThings = {};  // { 'uuid1dc65c13': { uuid: 'uuid1dc65c13', localURL: 'http://slave:80' }}
var allTags = {};
var allFeatures = {}

function init(cb) {
  superagent.get(baseurl + "/ls", function(err, res) {
    console.log("--------------------- ROT init ------------------");
    if (err) {
      cb(err);
      return;
    }

    var uuids = Object.keys(JSON.parse(res.text));
    console.log("ROT got uuids: ", uuids);
    allUuids = uuids;
    getAllThings(uuids, function(err, things) {
      allThings = things;
      console.log("ROT allThings: ", allThings);

      getAllFeatures(things, function(err, features) {
        allFeatures = features;
	      console.log("ROT allFeatures: ", allFeatures);
	      getAllTags(things, function(err, tags) {
          allTags = tags;
	        console.log("ROT allTags: ", allTags);
          cb();
        });
      });
    });
  });

  /*
   = get my data => GET /ls on directory => [data]
   = for each uuid => GET /thing/uuid/ => info registeded by each device/slave. {"uuid":uuid, "localURL": slave-rest-endpoint}
   = for each uuid => GET /tags/. First time, no tags defined (likely): brand new device.
   */
}

function queryTags(tags, cb) {
  // ["tag1", "tag2"], cb (resp, err)); where resp: {"tag1": ?, "tag2": ?}
  var resp = {};
  console.log("I AM IN QUERY TAGS IN ROT");
  console.log("allTags is ----", allTags);
  for (var i = 0; i < tags.length; i++) {
    resp[tags[i]] = allTags[tags[i]];
  }
  cb(resp);  // no error
}

function readTag(tag, cb) {
  var tagData = allTags[tag];
  if (tagData === undefined) {
    cb(undefined, "ROT No such tag: " + tag + " :(");
  } else if (tagData['url'] === undefined) {
    cb(undefined, "ROT No url for tag: " + tag + " :(");
  } else {
    superagent
    .get("http://" + tagData['url'], function (err, req) { cb(req.text, err);}) ;
  }
}

function writeTag(tag, data, cb) {
  var tagData = JSON.parse(allTags[tag]);
  if (tagData === undefined) {
    cb(undefined, "No such tag: " + tag + " :(");
  } else if (tagData['url'] === undefined) {
    cb(undefined, "No url for tag: " + tag + " :(");
  } else {
    superagent.put("http://" + tagData['url'])
	    .send(data)
	    .end(function(res){
        console.log("callback is ", cb);
        cb(res.text, !res.ok);
      });
  }
}

function getAllThings(uuids, cb) {
  console.log("------------------ROT GET ALL THINGS-------------------");
  var things = {};
  var errors = undefined;
  var done = 0;
  for (var i = 0; i < uuids.length; i++) {
    console.log("ROT uuids are ", uuids);
    (function() {
      var uuid = uuids[i];
      superagent.get(baseurl + "/thing/" + uuid, function(err, res) {
        if (err) {
          if (errors === undefined)
            errors = [];
          errors.push(err);
        } else {
          var thing = JSON.parse(res.text);
          console.log("Got thing: ", thing, " for uuid: ", uuid);
          things[uuid] = thing;
        }
        done ++;
        if (done === uuids.length) {
          cb(errors, things);
          console.log("THINGS are : ", things);
        }
      });
    })();
  }
}

function getAllTags(things, cb) {
  console.log("ROT I am in getAllTags having things :--------", things);
  var tags = {};
  var errors = undefined;
  var done = 0;
  for (var uuid in things) {
    (function(uuid) {
      var thing = things[uuid];
      console.log("ROT IN GETALLTAGS A thing:------------------", thing);
      superagent.get(thing['localURL'] + "/tags/", function(err, res) {
        console.log("--> getAllTags: err: ", err);
        if (err) {
          if (errors === undefined)
            errors = [];
          errors.push(err);
        } else {
          var tagsResp = JSON.parse(res.text);

          console.log("Got tagsResp: ", tagsResp, " for thing: ", thing);
          // merge tag lists

        for (var tagName in tagsResp) {
	      //var feature = tagsResp[tagName];
          console.log("tagName -------", tagName);
          if (tagsResp[tagName].url !== undefined) {
            //tags[tagName] = tagsResp[tagName];
            tags[tagName] = tagsResp[tagName].url;
          }
          if (tagsResp[tagName].val !== undefined) {
            //tags[tagName] = tagsResp[tagName];
            tags[tagName] = tagsResp[tagName].val;
          }
     	  }
        }
        done ++;
        if (done === Object.keys(things).length)
          cb(errors, tags);
      });
    })(uuid);
  }
}

function getAllFeatures(things, cb) {
  var features = {};
  var errors = undefined;
  var done = 0;
  for (var uuid in things) {
    (function(uuid) {
      var thing = things[uuid];
      console.log("ROT A THING LOOKS LIKE :", thing);
      console.log("thing[localURL]"+ thing['localURL'] +"/features/");
      superagent.get(thing['localURL'] + "/features/", function(err, res) {
        console.log("--> getAllFeatures: err: ", err, " res.text: ", res.text);
        if (err) {
          if (errors === undefined)
            errors = [];
          errors.push(err);
        } else {
          var featuresResp = JSON.parse(res.text);
          console.log("************************ Got featuresResp: ", featuresResp, " for thing: ", thing, "uuid:", uuid);
          features[uuid] = JSON.stringify(featuresResp);
        }
        done ++;
        if (done === Object.keys(things).length)
          cb(errors, features);
      });
    })(uuid);
  }
}

function getFeatures(cb) {
  cb(allFeatures);
}

function setTag(uuid, feature, tag, cb) {
  console.log("in setTag(uuid:", uuid, ", feature:", feature, ", tag:", tag, ")");
  console.log("allFeatures[uuid]", allFeatures[uuid]);
  console.log("allFeatures[uuid]*******************", JSON.parse(allFeatures[uuid])[feature]);
  //console.log("allFeatures[uuid][feature] is-------------------------- ", allFeatures[uuid][feature]);
  if (allFeatures[uuid] === undefined) {
    cb("No such uuid: " + uuid + " :( in allFeatures:" + allFeatures);
  } else if (JSON.parse(allFeatures[uuid])[feature] === undefined) {
    cb("No such feature: " + feature + " for uuid: " + uuid + " :(");
  } else if (tag in allTags) {
    cb("Tag alread used: " + tag + " :(");
  } else {
    var url = allThings[uuid].localURL + "/tags/" + tag;
    console.log("in SET TAG PUT(url)***************************", url);
    superagent.put(url)
      .send(feature)
      .end(function(res){
        allTags[tag] = allFeatures[uuid][feature];

        if (res.ok) {
          cb();
        } else {
          cb(res.text);
        }
      });
  }
}

// TODO:
function deleteTag(tag, cb) {
  if (allTags[tag] == undefined) {
    cb("No such tag: " + tag + " :(");
  } else {
    delete allTags[tag];
    cb();  // no error
  }
}

// See https://alicoding.com/write-javascript-modules-that-works-both-in-nodejs-and-browser-with-requirejs/
// make it work in both nodejs/browser.
global.init = init;
global.queryTags = queryTags;
global.readTag = readTag;
global.writeTag = writeTag;
global.getFeatures = getFeatures;
global.setTag = setTag;
global.deleteTag = deleteTag;

}(this));
