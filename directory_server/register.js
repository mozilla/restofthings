var baseurl = "http://10.0.0.3:8080";
var url = "10.0.0.3";
//var baseurl = "http://10.251.38.229:8080";
//var url = "10.251.38.229";

$.ajax({"url":baseurl + "/ls"}).done(function (data) {
  if (Object.keys(data).length === 0) {
    alert('NO DEVICES AVAILABLE AT THE MOMENT :(');
  }
  for (var key in data) {
    console.log("key is ", key);
    var payload = JSON.parse(data[key].payload);
    getFeaturesForThing(key, payload.localURL);
  }
});

function findTags(feature, tags) {
  var l = [];
  for (var key in tags) {
    if (JSON.parse(tags[key]).feature + "" === feature) {
      l.push(key);
    }
  }
  return l;
}

function findFreeTags(address, tags) {
  var l = [];
  for (var key in tags) {
    if (JSON.parse(tags[key]).uuid + "" === address) {
      l.push(key);
    }
  }
  return l;
}

function writeTagTable(features, tags, address) {
  $.each(features, function(fname, finfo) {
    var row = $('<tr>');
    $('<td>').text(fname).appendTo(row);
    var tagsSelector = $('<input type="hidden" style="width:300px" />');
    tagsSelector.attr('id', address);
    tagsSelector.appendTo(row);
    tagsSelector.select2({tags:[],
      tokenSeparators: [",", " "]
    });
    tagsSelector.val(findTags(fname, tags)).trigger("change");

    tagsSelector.on("change", function(e) {
      console.log(e.added, e.removed);
      if (e.added !== undefined) {
        var newTag = e.added.text;
        var tagUrl = this.id + '/tags/' + newTag.split(":")[0];
        var appendURL = "";
        var regex = /\:\//;
        var url = {"url":finfo.url, "feature":fname};
        if (regex.test(newTag)) {
          appendURL = newTag.split(":")[1];
          url.url = url.url.concat(appendURL);
        }
        $.ajax({url: tagUrl, type:'PUT', data: JSON.stringify(url)})
         .done(function(data) { console.log('Tag: ', newTag, 'defined!'); });
      }

      if (e.removed !== undefined) {
        var oldTag = e.removed.text;
        var tagUrl =  this.id +'/tags/' + oldTag;
        console.log('Deleting tag', tagUrl);
        $.ajax({url: tagUrl, type:'DELETE'})
         .done(function(data) { console.log('Tag: ', oldTag, 'DELETED!'); });
      }
    });

    $('#tagstable').append(row);
  });
}

function writeMiddleHeader(address) {
  var row = $('<tr>');
  $('<td>').text("FEATURES { " + address + " }").addClass("info").appendTo(row);
  $('<td>').text("TAGS ").addClass("success").appendTo(row);
  $('#tagstable').append(row);
}

function writeFreeTags(key, tags, address){
  console.log('key:', key);
  console.log('address:', address);
  var row = $('<tr>');
  $('<td>').text("free form tags [ no feature associated ] { " +  key + "}").addClass("warning").appendTo(row);
  var tagsSelector = $('<input type="hidden" style="width:300px" />');
  tagsSelector.attr('id', address);
  tagsSelector.appendTo(row);
  tagsSelector.select2({tags:[],
    tokenSeparators: [",", " "]
  });

  tagsSelector.val(findFreeTags(address, tags)).trigger("change");
  tagsSelector.on("change", function(e) {
    console.log(e.added, e.removed);
    if (e.added !== undefined) {
      var newTag = e.added.text;
      var tagUrl = this.id + '/tags/' + newTag.split(":")[0];
      var value = newTag.split(":");
      value.shift();
      value = value.join("");
      var val = {"val":value, "uuid": address};
      console.log('Adding tag ------', tagUrl);
      console.log("free tag is -----", val);
      $.ajax({url: tagUrl, type:'PUT', data: JSON.stringify(val)})
       .done(function(data) { console.log('freee tag TagURL: ', tagUrl, 'defined!', "data is ", data); });
    }
    if (e.removed !== undefined) {
      var oldTag = e.removed.text;
      var tagUrl =  this.id +'/tags/' + oldTag;
      console.log('Deleting tag', tagUrl);
      $.ajax({url: tagUrl, type:'DELETE'})
       .done(function(data) { console.log('Tag: ', oldTag, 'DELETED!'); });
    }
  });
  $('#tagstable').append(row);
}

function getFeaturesForThing(key, address) {
  $(document).ready(function () {
    $.ajax({url: address + '/features'})
     .done(function (features) {
       console.log("GET FEATURES FOR THING: ", features);
       $.ajax({url: address + '/tags'})
        .done(function (tags) {
          console.log("DATA FEATURES: ", features, "TAGS:", tags);
          writeMiddleHeader(key);
          writeTagTable(features, tags, address);
          writeFreeTags(key, tags, address);
        });
     });
  });
}
