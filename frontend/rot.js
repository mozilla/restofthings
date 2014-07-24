var request = require('superagent');

var baseurl = "http://localhost:8080";

var allUuids = [];
var allThings = {};  // { 'uuid1dc65c13': { uuid: 'uuid1dc65c13', localURL: 'http://slave:80' }}
var allTags = {};
var allFeatures = {
    'uuid1': {
	"factory-name-for-led1-C00FF33": {'url': 'localhost:1234'},  // use fakeLed
	"useless-device-MQYOK7N1WA*#22": {'url': 'localhost:1235'},
    },
    'uuid2': {
	"wat-is-dis-3493YAT1PL--24": {'url': 'pi2/lol1'},
	"gigagator-ultra-leds-inqqpa2": {'url': 'pi2/led2'},
    }
}

exports.init = function init(cb) {
    request.get(baseurl + "/ls", function(err, res) {
        if (err) {
	    cb(err);
	    return;
	}

        var uuids = JSON.parse(res.text);
	console.log("got uuids: ", uuids);
	allUuids = uuids;
	getAllThings(uuids, cb);
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

// Simulate the internets
var webDump = {
    'pi1/led1': 'off', 
    'pi2/led2': 'on',
};

function wget(url, cb) {
    var data = webDump[url];
    if (data === undefined) {
	cb(undefined, "No data for url: " + url + " :(");
    } else {
	cb(data);  // no error
    }
}

function wput(url, data, cb) {
    webDump[url] = data;
    cb('empty-wput-response');  // no error
}

exports.readTag = function readTag(tag, cb) {
    var tagData = allTags[tag];
    if (tagData === undefined) {
	cb(undefined, "No such tag: " + tag + " :(");
    } else if (tagData['url'] === undefined) {
	cb(undefined, "No url for tag: " + tag + " :(");
    } else {
	wget(tagData['url'], cb);
    }
}

exports.writeTag = function writeTag(tag, data, cb) {
    var tagData = allTags[tag];
    if (tagData === undefined) {
	cb(undefined, "No such tag: " + tag + " :(");
    } else if (tagData['url'] === undefined) {
	cb(undefined, "No url for tag: " + tag + " :(");
    } else {
	wput(tagData['url'], data, cb);
    }
}


function getAllThings(uuids, cb) {
    allThings = {};
    var errors = undefined;
    for (var i = 0; i < uuids.length; i++) {
	(function() {
	    var uuid = allUuids[i];
	    request.get(baseurl + "/thing/" + uuid, function(err, res) {
		if (err) {
		    if (errors === undefined) 
			errors = [];
		    errors.push(err);
		} else {
		    var thing = JSON.parse(res.text);
		    console.log("Got thing: ", thing, " for uuid: " + uuid);
		    allThings[uuid] = thing;
		}
		if (Object.keys(allThings).length === allUuids.length)
		    cb(errors, allThings);
	   });
	})();
    }
}


exports.getFeatures = function getFeatures(cb) {
    allFeatures = {};
    var errors = undefined;
    for (var i = 0; i < allUuids.length; i++) {
	(function() {
	    var uuid = allUuids[i];
	    request.get(baseurl + "/thing/" + uuid, function(err, res) {
		if (err) {
		    if (errors === undefined) 
			errors = [];
		    errors.push(err);
		} else {
		    var features = JSON.parse(res.text);
		    console.log("Got features: ", features, " for uuid: " + uuid);
		    allFeatures[uuid] = features;
		}
		if (Object.keys(allFeatures).length === allUuids.length)
		    cb(errors, allFeatures);
	   });
	})();
    }
}

exports.setTag = function setTag(uuid, feature, tagName, cb) {
    if (allFeatures[uuid] === undefined) {
	cb("No such uuid: " + uuid + " :(");
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

exports.deleteTag = function deleteTag(tag, cb) {
    if (allTags[tag] == undefined) {
	cb("No such tag: " + tag + " :(");
    } else {
	delete allTags[tag];
	cb();  // no error
    }    
}

