var baseurl = "http://10.0.0.3:8080";
var url = "10.0.0.3";
$.ajax({"url":baseurl + "/lsall"}).done(function (data) {
  console.log("DATA is ", data);
  var jsonData = JSON.parse(data);
  for (key in jsonData) {
    console.log("key is", key);
    getFeaturesForThing("http://" + key + ":3000");
    getFeaturesForThing("http://" + key + ":3001");
    $.ajax({"url":baseurl + "/ls"}).done(function (data) {
      console.log("data is &&&&&&&&&&&&&&&&&&&&", data);
      
    });
  };
})



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
      console.log("e has text ------------", e, "*************", this.id);
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
  //console.log('features:', features);
  //$.each(features, function(fname, finfo) {
    var row = $('<tr>');
    //row.attr('class', 'active');
    $('<td>').text("features available for " + address).addClass("info").appendTo(row);
    $('<td>').text("TAGS ").addClass("success").appendTo(row);

  $('#tagstable').append(row);

}



function getFeaturesForThing(address) {
  $(document).ready(function () {
    $.ajax({url: address + '/features'})
      .done(function (features) {
        $.ajax({url: address + '/tags'})
          .done(function (tags) {
            console.log("DATA FEATURES: ", features, "TAGS:", tags);
            writeMiddleHeader(address);
            writeTagTable(features, tags, address);
          });
      });
  });
}
