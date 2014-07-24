var rot = require('./fakerot');

function forEach(obj, cb) {
    for (var e in obj) {
	cb(e);
    }    
}

function readTags(tags, cb) {
    var readValues = {};
    forEach(tags, function(tag) {
	console.log("tag: ", tag);
	rot.readTag(tag, function(data, err) {
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
	rot.writeTag(tag, "off", function(data, err) {
   	    readValues[tag] = data;
	    if (err)
		console.log("Error from readTag: ", err);
	    if (Object.keys(readValues).length === Object.keys(tags).length)
		cb(readValues);
	});
    });  
}

rot.init(function() {
     console.log('init');
     rot.queryTags(['led1', 'led2'], function(tags, err) {
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
