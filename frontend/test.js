//var rot = require('./rot');

function forEach(obj, cb) {
    for (var e in obj) {
	cb(e);
    }    
}

function readTags(tags, cb) {
    var readValues = {};
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

function turnOffLigths(tags, cb) {
    var readValues = {};
    forEach(tags, function(tag) {
	console.log("tag: ", tag);
	writeTag(tag, "off", function(data, err) {
   	    readValues[tag] = data;
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
    setTag('uuid1', "factory-name-for-led1-C00FF33", 'led1', function(err) {
	if (err) {
	    cb(err);
	    return;
	}
	setTag('uuid2', "gigagator-ultra-leds-inqqpa2", 'led2', cb);
    });
}

init(function() {
     console.log('init');
     console.log("OMG: allFeatures:", allFeatures)
	 setTags(function(err) {
	 if (err) {
	     console.log("Error in setTags: ", err);
	     return;
	 }
	 queryTags(['led1', 'led2'], function(tags, err) {
	      console.log("queryTags: ", tags, err);
	      readTags(tags, function (tagsData) {
		  console.log("read all tags: ", tagsData);
		  turnOffLigths(tags, function(ligthsData) {
		      console.log("turnOff responses: ", tagsData);
		      readTags(tags, console.log);
		  });
	     });
	 });
     });
});
