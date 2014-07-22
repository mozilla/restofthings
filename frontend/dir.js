var baseurl = "http://10.251.43.233:8080";
//var baseurl = "http://10.0.0.6:8080";
$.ajax({"url":baseurl + "/ls"}).done(function (data) {

  console.log("date primite pe ls ", data);
  var ls = JSON.parse(data);
  ls.forEach(function (thingid) {
    var url = baseurl + "/thing/" + thingid;
    console.log("thingid is ", thingid, "url is ", url);
    console.log('my url is ', url);
    $.ajax({"url":url}).done(function (data) {
      var entry = JSON.parse(data);
      var img=new Image();
      console.log("the url for the image is ", entry.localURL);
      img.src = entry.localURL;
      document.body.appendChild(img);
      console.log("regret sa-ti zic ca entry.url este", entry.localURL);
      })
    });
  });
