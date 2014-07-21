var baseurl = "http://10.0.0.6:8080";
$.ajax({"url":baseurl + "/ls"}).done(function (data) {
  var ls = JSON.parse(data);
  ls.forEach(function (thingid) {
    var url = baseurl + "/thing/" + thingid;
    console.log('my url is ', url);
// alert(url);
    $.ajax({"url":url}).done(function (data) {
      var entry = JSON.parse(data);
      $.ajax({"url":entry.localURL}).done(function (data) {
        alert(data);
      })
    });
  });
});
