function app(){
  console.log("in app()");
  ROT.queryTags(['led1'], function(tags, err) {
    console.log("APP tags are", tags);
    listExistingTags(tags, setup);
  });
};

function listExistingTags(links, cb){
  console.log("links is : ", links);
  for (var key in links) {
    if (links[key] !== undefined)
    $('<a>',{
      text: " " + links[key],
      title: key,
      href:  links[key]
    }).appendTo('#'+ key);
  }
  cb(links);
}

function setup() {
  ROT.readTag('led1', function(data, err) {
    if (err)
      console.log("****************** I fail miserably to read url of my led :(******************", err);
    console.log("**** |o/ **************************** data is ", data);
    var url = data;
  })
  var pushMe = $('<button/>', {
    text: 'ChangeState',
    click: function () { console.log('hi');
      ROT.readTag("led1", function(state) {
        console.log("STATE of led1 in readTAG is ", state);
        if (state === "on") {
          console.log("---------------i am in state is on");
          ROT.writeTag("led1", "off", function(err){console.log("LED1 OFF-----", err);});
        } else {
          ROT.writeTag("led1", "on", function(err){console.log("LED1 ON----", err);  });
        }
      });
      ROT.readTag('led1', function(data, err){console.log("read state of led1: ", data);});

    }}).addClass("btn btn-success");
  $("#myDiv").append(pushMe);
}

function forEach(obj, cb) {
  for (var e in obj) {
    cb(e);
  }
}

ROT.init(app);
