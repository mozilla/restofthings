var baseurl = "http://10.0.0.3:8080";
var url = "10.0.0.3";
$.ajax({"url":baseurl + "/lsall"}).done(function (data) {
  var things = JSON.parse(data)["10.0.0.5"];
  console.log("THINGS: ", things);

  for (var key in things) {
    var pl =JSON.parse(things[key].payload);
    if (things.hasOwnProperty(key)) {
      console.log("key is ", key);
      constructButton(key, Object.keys(pl.features));
    }
  }

  function constructButton(thingId, features) {
    console.log("thingId: ", thingId);

    $('<button/>', {
      text: "thing " + thingId + " has features :",
      id: 'thing_' + thingId,
      click: function () {
        console.log("MUAHAHAH");
      }
    }).addClass("btn btn-success").appendTo("#myDiv");

    for (var i in features)
      $('<button/>', {
        text: features[i],
        id: 'feature_' + features[i]
      }).addClass("btn btn-info").appendTo("#myDiv");

    $('<button/>', {
      text: "tagFeaturesForThing",
      click: function(){window.location.href='http://10.0.0.5';},
      id: 'tag_features' + thingId
    }).addClass("btn btn-danger").appendTo("#myDiv");

    $("#myDiv").append('<br/>');

  }

});
