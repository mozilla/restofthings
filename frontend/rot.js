var request = require('superagent');

var baseurl = "http://localhost:8080";

var allUuids = [];
var allThings = {};  // { 'uuid1dc65c13': { uuid: 'uuid1dc65c13', localURL: 'http://slave:80' }}
var allTags = {};
allFeatures = {}

exports.init = function init(cb) {
    request.get(baseurl + "/ls", function(err, res) {
        if (err) {
	    cb(err);
	    return;
	}

        var uuids = JSON.parse(res.text);
	console.log("got uuids: ", uuids);

	allUuids = uuids;
	getAllThings(uuids, function(err, things) {
	    allThings = things;
	    console.log("allThings: ", allThings);
	    getAllTags(things, function(err, tags) {
		allTags = tags;
		console.log("allTags: ", allTags);
		getAllFeatures(things, function(err, features) {
		    allFeatures = features;
		    console.log("allFeatures: ", allFeatures);
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

exports.queryTags = function queryTags(tags, cb) {
    // ["tag1", "tag2"], cb (resp, err)); where resp: {"tag1": ?, "tag2": ?}
    var resp = {};
    for (var i = 0; i < tags.length; i++) {
	resp[tags[i]] = allTags[tags[i]];
    }
    cb(resp);  // no error
}

exports.readTag = function readTag(tag, cb) {
    var tagData = allTags[tag];
    if (tagData === undefined) {
	cb(undefined, "No such tag: " + tag + " :(");
    } else if (tagData['url'] === undefined) {
	cb(undefined, "No url for tag: " + tag + " :(");
    } else {
	request(tagData['url'], function (err, req) { cb(req.text, err);}) ;
    }
}

exports.writeTag = function writeTag(tag, data, cb) {
    var tagData = allTags[tag];
    if (tagData === undefined) {
	cb(undefined, "No such tag: " + tag + " :(");
    } else if (tagData['url'] === undefined) {
	cb(undefined, "No url for tag: " + tag + " :(");
    } else {
	request.put(tagData['url'], data, function (err, req) { cb(req.text, err);});
    }
}


function getAllThings(uuids, cb) {
    var things = {};
    var errors = undefined;
    var done = 0;
    for (var i = 0; i < uuids.length; i++) {
	(function() {
	    var uuid = uuids[i];
	    request.get(baseurl + "/thing/" + uuid, function(err, res) {
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
		if (done === uuids.length)
		    cb(errors, things);
	   });
	})();
    }
}

function getAllTags(things, cb) {
    var tags = {};
    var errors = undefined;
    var done = 0;
    for (var uuid in things) {
	(function() {
	    var thing = things[uuid];
	    console.log("thing:", thing);
	    request.get(thing['localURL'] + "/tags/", function(err, res) {
		console.log("--> getAllTags: err: ", err, " res.text: ", res.text);
		if (err) {
		    if (errors === undefined) 
			errors = [];
		    errors.push(err);
		} else {
		    var tagsResp = JSON.parse(res.text);
		    console.log("Got tagsResp: ", tagsResp, " for thing: ", thing);
		    // merge tag lists
		    for (var k in tagsResp) 
			tags[k] = tagsResp[k];
		}
		done ++;
		if (done === Object.keys(things).length)
		    cb(errors, tags);
	   });
	})();
    }
}


function getAllFeatures(things, cb) {
    var features = {};
    var errors = undefined;
    var done = 0;
    for (var uuid in things) {
	(function(uuid) {
	    var thing = things[uuid];
	    console.log("thing:", thing);
	    request.get(thing['localURL'] + "/features/", function(err, res) {
		console.log("--> getAllFeatures: err: ", err, " res.text: ", res.text);
		if (err) {
		    if (errors === undefined) 
			errors = [];
		    errors.push(err);
		} else {
		    var featuresResp = JSON.parse(res.text);
		    console.log("Got featuresResp: ", featuresResp, " for thing: ", thing, "uuid:", uuid);
		    features[uuid] = featuresResp;
		}
		done ++;
		if (done === Object.keys(things).length)
		    cb(errors, features);
	   });
	})(uuid);
    }
}

exports.getFeatures = function getFeatures(cb) {
    cb(allFeatures);
}

exports.setTag = function setTag(uuid, feature, tag, cb) {
    if (allFeatures[uuid] === undefined) {
	cb("No such uuid: " + uuid + " :( in allFeatures:" + allFeatures);
    } else if (allFeatures[uuid][feature] === undefined) {
	cb("No such feature: " + feature + " for uuid: " + uuid + " :(");
    } else if (tag in allTags) {
	cb("Tag alread used: " + tag + " :(");
    } else {
	// allTags = {"led1": {"url": "pi1/led1"}, "led2": {"url": "pi2/led2"}};
	allTags[tag] = allFeatures[uuid][feature];
	cb();  // no error
    }
}


// TODO:
exports.deleteTag = function deleteTag(tag, cb) {
    if (allTags[tag] == undefined) {
	cb("No such tag: " + tag + " :(");
    } else {
	delete allTags[tag];
	cb();  // no error
    }    
}

