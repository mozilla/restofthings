const fs = require("fs")
const url = require("url")
const utf8 = require("utf8")
const express = require("express")
var getRawBody = require('raw-body');
var app = express();
var cors = require('cors');
var config = JSON.parse(fs.readFileSync(process.argv[2]));
var things = {}

app.use(cors());

app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf8'
  }, function (err, string) {
    if (err)
      return next(err);
    req.text = string;
    next()
  })
});

/** put json to /thing/stable-uuid
 {'uuid':x, 'localurl':y, 'tags':["tag1", ..], 'description':"raspberry pi"}
 repeat calls here should just PUT an empty body...Server will 404 if body not already present
 */
function putPing(uuid, remoteAddress, payload) {
  var network = things[remoteAddress];
  if (!network) {
    things[remoteAddress] = network = {};
  }
  var thing = network[uuid];
  if (!thing) {
    console.log("got no thing :(");
    network[uuid] = thing = {};
    console.log("network is ", network);
  }
  thing.expiryTime = Date.now();
  thing.payload = payload.toString('utf8');
}

function getNetwork(req) {
  var remoteAddress = req.connection.remoteAddress;
  console.log("my remote address is ------", remoteAddress);
  var network = things[remoteAddress];
  if (!network)
    network = {};
  return network;
}

app.get('/ls', function(req, res) {
  res.json(getNetwork(req));
});

app.get(/^\/thing\/([A-z:0-9.-]+|\*)$/, function(req, res){
  var network = getNetwork(req);
  var uuid = req.path.substr("/thing/".length);
  var thing = network[uuid];
  if (!thing)
    return res.send(404, "No thing " + uuid + " in " + req.connection.remoteAddress + " network");
  return res.send(thing.payload);
});

app.put(/^\/thing\/([A-z:0-9.-]+|\*)$/, function(req, res){
  var uuid = req.path.substr("/thing/".length);
  var remoteAddress = req.connection.remoteAddress;
  console.log("request.connection.remoteAddress", req.connection.remoteAddress);
  putPing(uuid, remoteAddress, req.text);
  res.send("OK");
});

//app.set(function(){
  //app.use('/clientPage', express.static(__dirname + '/clientPage'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/lib'));

//});
app.listen(config.port);

console.log("Server running at\n  =>"+config.host+":" + config.port + "/\nCTRL + C to shutdown");
