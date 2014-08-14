(function(exports){
"use strict";
var ROT = {};
var baseurl = "http://10.0.0.3:8080";
var allUuids = [];
var allThings = {};
var allFeatures = {}
var allTags = {};

ROT.init = function init(cb) {
  superagent.get(baseurl + "/ls", function (err, res) {
    console.log("--------------------- ROT init ------------------");
    if (err) {
      cb(err);
      return;
    }
    allUuids = Object.keys(JSON.parse(res.text));
    console.log("ROT got uuids: ", allUuids);
    _getAllThings(allUuids, function (err, things) {
      allThings = things;
      console.log("ROT allThings: ", allThings);
      _getAllFeatures(things, function (err, features) {
        allFeatures = features;
        console.log("ROT allFeatures: ", allFeatures);
        _getAllTags(things, function (err, tags) {
          allTags = tags;
          console.log("ROT allTags: ", allTags);
          cb();
        });
      });
    });
  });
};

function _getAllThings(uuids, cb) {
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
          things[uuid] = thing;//things = {uuid1:{}, uuid2:{}};
        }
        done ++;
        if (done === uuids.length) {
          cb(errors, things);
        }
      });
    })();
  }
};

function _getAllFeatures(things, cb) {
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
         //var featuresResp = JSON.parse(res.text);
         //features[uuid] = JSON.stringify(featuresResp);
           features[uuid] = res.text;
         }
         done ++;
         if (done === Object.keys(things).length)
         cb(errors, features);
       });
    })(uuid);
  }
};

function _getAllTags(things, cb) {
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
};

ROT.setTag = function setTag(uuid, feature, tag, cb) {
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
};

ROT.writeTag = function writeTag(tag, data, cb) {
  var tagData = allTags[tag];
  if (tagData === undefined) {
    cb(undefined, "No such tag: " + tag + " :(");
  } else if (tagData === undefined) {
    cb(undefined, "No url for tag: " + tag + " :(");
  } else if (_isValidURL(tagData)){
    console.log("valid tag is:", tagData)
    superagent.put(tagData)
      .send(data)
      .end(function(res){
        console.log("callback is ", cb);
        cb(res.text, !res.ok);
      });
  } else {
    //return value for this key
    return tagData;
  }
};

ROT.readTag = function readTag(tag, cb) {
  var tagData = allTags[tag];
  if (tagData === undefined) {
    cb(undefined, "ROT No such tag: " + tag + " :(");
  } else if (tagData === undefined) {
    cb(undefined, "ROT No url for tag: " + tag + " :(");
  } else if (_isValidURL(tagData)) {
    superagent
      .get(tagData)
      .end(function(res){
        console.log("res is ", res);
        cb(res.text);
      });
  } else {
    return tagData;
  }
};

ROT.deleteTag = function deleteTag(tag, cb) {
  if (allTags[tag] == undefined) {
    cb("No such tag: " + tag + " :(");
  } else {
    delete allTags[tag];
    cb();  // no error
  }
};


function _isValidURL(url){
  var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if(RegExp.test(url)){
    return true;
  } else {
    return false;
  }
}

exports.ROT = ROT;
return exports.ROT;
})(this);