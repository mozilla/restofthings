//get all features on all slaves
//var baseurl = "http://10.251.43.233:8080/ls";
var baseurl = "http://10.0.0.6:8080/ls";


function getFeatures(uuid) {
    var url = "http://10.0.0.6:8080/thing/" + uuid;
    var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    if (e.target.status == 200) {
      var features = JSON.parse(e.target.responseText);
      console.log("FEATURES ", features.localURL.split(":")[1]);
      var anotherUrl = features.localURL.split(":")[1] + ":80"  + "/features";
      console.log("another url", anotherUrl);
      getFeaturesFromSlave(anotherUrl);
    } else {
      console.log("BALBALALALALALZZZZZZZZZALA " + url + " with " +
        e.target.status);
    }
  };

  xhr.open("get", url, true);
  xhr.send();

}

function getFeaturesFromSlave(url) {
  console.log("URL IS ", url);
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    if (e.target.status == 200) {
      var features = JSON.parse(e.target.responseText);
      console.log("kdshsakhdkashdkashdAAAAAAAA----", features)
    } else {
      console.log("BALBALALALALALZZZZZZZZZALA " + url + " with " +
        e.target.status);
    }
  };

  console.log("<><><><> ", url);
  xhr.open("get", url, true);
  xhr.send();
}

function getAllFeatures() {
    //$.ajax({"url":baseurl + "/ls"}).done(function (data) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
    if (e.target.status == 200) {
      var things = JSON.parse(e.target.responseText);
      for (var i = 0; i < things.length; i++) {
        console.log("the thing is ", things[i]);
        getFeatures(things[i]);
      }
    } else {
      console.log("BALBALALALALALALA " + url + " with " +
        e.target.status);
    }
    };

    xhr.open("get", baseurl, true);
    xhr.send();
    console.log("dlkadlsflsdhflsd");
  //ls -- to registry server
    //for every elem in ls call /thing/elem --> urls to things --> tags {cam1:link}
    //make a dictionary to all and keep that in mem
    //for every thing url ->/features --> list of features --> {}
}

function queryTags(tags) {

  //ls -- to registry server
  //for every elem in ls call /thing/elem --> urls to things --> tags {cam1:link}
  //make a dictionary to all and keep that in mem
  //for every thing url ->/features --> list of features --> {}
  //for a list of features queryTags(["securityCamera", "garageDoorRelay"]) --> list of urls
  //read data from urls/ write data to urls

}
getAllFeatures();
