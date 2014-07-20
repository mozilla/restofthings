var baseurl = "http://localhost:8080";
console.log("FUCK");
$.ajax({"url":baseurl + "/ls"}).done(function (data) {

  console.log("MUAUHAHAHA", data);
  var ls = JSON.parse(data);
  ls.forEach(function (thingid) {
    var url = baseurl + "/thing/" + thingid;
    console.log("thingid is ", thingid, "url is ", url);
   // alert(url);
    $.ajax({"url":url}).done(function (data) {
      var entry = JSON.parse(data);

      console.log("entry ", entry);
      $.ajax({"url":entry.localURL}).done(function (data) {
        alert(data);
      })
    });
  });
});
