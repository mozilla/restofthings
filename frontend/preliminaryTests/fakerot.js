
var allTags = {};
exports.init = function init(cb) {
    allTags = {"led3": {"url": "pi1/led1"}, "led2": {"url": "pi2/led2"}};
    cb();

/*
  = get my uuids => GET /ls on directory => [uuids]
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

var allFeatures = {
    'uuid1': {
	"factory-name-for-led1-C00FF33": {'url': 'pi1/led1'},
	"useless-device-MQYOK7N1WA*#22": {'url': 'pi1/sadDevice1'},
    },
    'uuid2': {
	"wat-is-dis-3493YAT1PL--24": {'url': 'pi2/lol1'},
	"gigagator-ultra-leds-inqqpa2": {'url': 'pi2/led2'},
    }
}

exports.getFeatures = function getFeatures(cb) {
    cb(allFeatures);
}

exports.setTag = function setTag(uuid, feature, tag, cb) {
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

