(function(global) {

if (typeof superagent === 'undefined') {
    superagent = require('superagent');
}

var baseurl = "http://10.0.0.3:8080";

var allUuids = [];
var allThings = {};  // { 'uuid1dc65c13': { uuid: 'uuid1dc65c13', localURL: 'http://slave:80' }}
var allTags = {};
var allFeatures = {}

function isValidURL(url){
  var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if(RegExp.test(url)){
    return true;
  }else{
    return false;
  }
}

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
  for (var i = 0; i < tags.length; i++) {
    resp[tags[i]] = allTags[tags[i]];
  }
  cb(resp);  // no error
}
//this works only for http requests not free tags
function readTag(tag, cb) {
  var tagData = allTags[tag];
  if (tagData === undefined) {
    cb(undefined, "ROT No such tag: " + tag + " :(");
  } else if (tagData === undefined) {
    cb(undefined, "ROT No url for tag: " + tag + " :(");
  } else if (isValidURL("http://" +tagData)) {
      superagent
        .get("http://" + tagData)
        .end(function(res){
          console.log("res is ", res);
          cb(res.text);
        });
  } else {
      return tagData;
  }
}

//this works only for http requests not for free tags
function writeTag(tag, data, cb) {
  var tagData = allTags[tag];
  console.log("IN WRITE TAG and tagData is ", tagData);
  if (tagData === undefined) {
    cb(undefined, "No such tag: " + tag + " :(");
  } else if (tagData === undefined) {
    cb(undefined, "No url for tag: " + tag + " :(");
  } else if (isValidURL(tagData)){
      //superagent.post("http://" + tagData)
      console.log("valid tag is:", tagData)
      //var url = "http://" + tagData;
      superagent.put("http://" + tagData)
	    .send(data)
	    .end(function(res){
        console.log("callback is ", cb);
        cb(res.text, !res.ok);
      });
  } else {
    return tagData;
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
          things[uuid] = thing;
        }
        done ++;
        if (done === uuids.length) {
          cb(errors, things);
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
          if (JSON.parse(tagsResp[tagName]).url !== undefined) {
            tags[tagName] = JSON.parse(tagsResp[tagName]).url;
          }
          if (JSON.parse(tagsResp[tagName]).val !== undefined) {
            tags[tagName] = JSON.parse(tagsResp[tagName]).val;
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
      superagent.get(thing['localURL'] + "/features/", function(err, res) {
        console.log("--> getAllFeatures: err: ", err, " res.text: ", res.text);
        if (err) {
          if (errors === undefined)
            errors = [];
          errors.push(err);
        } else {
          var featuresResp = JSON.parse(res.text);
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

//only tags for  features
function setTag(uuid, feature, tag, cb) {
  var data = {"url":JSON.parse(allFeatures[uuid])[feature].url, "feature":feature};
  if (allFeatures[uuid] === undefined) {
    cb("No such uuid: " + uuid + " :( in allFeatures:" + allFeatures);
  } else if (JSON.parse(allFeatures[uuid])[feature] === undefined) {
    cb("No such feature: " + feature + " for uuid: " + uuid + " :(");
  } else if (tag in allTags) {
    cb("Tag already used: " + tag + " :(");
  } else {
    var url = allThings[uuid].localURL + "/tags/" + tag;
    superagent.put(url)
      .send(data)
      .end(function(res){
        allTags[tag] = JSON.parse(allFeatures[uuid])[feature].url;
        if (res.ok) {
          cb();
        } else {
          cb(res.text);
        }
      });
  }
}

// TODO:implementation & testing as not sure if we want to expose it
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
