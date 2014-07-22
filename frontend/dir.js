var baseurl = "http://10.0.0.6:8080";
$.ajax({"url":baseurl + "/ls"}).done(function (data) {

  console.log("MUAUHAHAHA", data);
  var ls = JSON.parse(data);
  ls.forEach(function (thingid) {
    var url = baseurl + "/thing/" + thingid;
<<<<<<< HEAD
    console.log("thingid is ", thingid, "url is ", url);
=======
    console.log('my url is ', url);
// alert(url);
>>>>>>> 4af0ccab48a589f3b915dfc3e36959e99721c387
    $.ajax({"url":url}).done(function (data) {
      var entry = JSON.parse(data);

      console.log("entry ", entry);
      $.ajax({"url":entry.localURL}).done(function (data) {
        alert(data);
      })
    });
  });
});
