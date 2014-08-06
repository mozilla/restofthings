var baseurl = "http://10.0.0.3:8080";
var url = "10.0.0.3";
$.ajax({"url":baseurl + "/ls"}).done(function (data) {
  var data = JSON.parse(data);
  if (Object.keys(data).length === 0) {
    alert('NO DEVICES AVAILABLE AT THE MOMENT :(');
  }
  for (var key in data) {
    console.log("key is ", key);
    var payload = JSON.parse(data[key].payload);
    getFeaturesForThing(key, payload.localURL);
  }
});

function findTags(address, feature, tags) {
  var l = [];
  console.log("I am in find tags and i have feature:", feature, "tags is : ", tags, " address is", address);
  $.each(tags, function(tag, fname) { if (fname === feature) l.push(tag); });
  console.log("findTags:", l);
  return l;
}

function writeTagTable(features, tags, address) {
  console.log('features:', features);
  $.each(features, function(fname, finfo) {
    var row = $('<tr>');
    $('<td>').text(fname).appendTo(row);

    var tagsSelector = $('<input type="hidden" style="width:300px" />');
    tagsSelector.attr('id', address);
    tagsSelector.appendTo(row);

    // See http://ivaynberg.github.io/select2/
    // Accept user defined strings (nothing predefined => tags:[])
    tagsSelector.select2({tags:[],
      tokenSeparators: [",", " "]
      });

    // Populate with already defined tags. Only calling 'val' is
    // not enough. To make the value change  visible in UI have to
    // trigger the 'change' event.
    tagsSelector.val(findTags(address, fname, tags)).trigger("change");

    tagsSelector.on("change", function(e) {
      console.log(e.added, e.removed);
      if (e.added !== undefined) {
        var newTag = e.added.text;
        var tagUrl = this.id + '/tags/' + newTag;
        console.log('Adding tag', tagUrl);
        $.ajax({url: tagUrl, type:'PUT', data: fname})
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

function getFeaturesForThing(key, address) {
  $(document).ready(function () {
    $.ajax({url: address + '/features'})
      .done(function (features) {
        $.ajax({url: address + '/tags'})
          .done(function (tags) {
            console.log("DATA FEATURES: ", features, "TAGS:", tags);
            writeMiddleHeader(key);
            writeTagTable(features, tags, address);
          });
      });
  });
}
