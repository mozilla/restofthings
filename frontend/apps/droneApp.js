function app(){
  var start = $('<button/>',{
    id:"start",
    text: 'takeoff',
    click: function () {
      ROT.writeTag("drone", "start", function(data){
        console.log("wrote data to drone");
      });
    }
  }).addClass("btn btn-success");
  $("#myDiv").append(start);

  var stop = $('<button/>',{
    id:"stop",
    text: 'land',
    click: function () {
      ROT.writeTag("drone", "stop", function(data){
        console.log("wrote data to drone ");
      });
    }
  }).addClass("btn btn-success");
  $("#myDiv").append(stop);
};

ROT.init(app);
