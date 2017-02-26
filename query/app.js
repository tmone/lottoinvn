var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

var mongoose = require('mongoose');
mongoose.connect('mongodb://z500.top:27017/rawlot');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

var rsLotSchema = mongoose.Schema({
  dai: String,
  ngay: String,
  date: Date,
  ket: []
});

var KetQua = mongoose.model('KetQua', rsLotSchema);

function convRs(a) {
  var rs = '';
  var tmpa = [];
  for (var i = 0; i < a.length; i++) {
    var l = a[i].g;
    if (!Number.isInteger(l)) {
      l = 0;
    }
    tmpa[l] = a[i].v.split(" ").join("").split("  ").join("").split("-").join("").trim();
  }
  rs = tmpa.reverse().join("").trim();
  return rs;
}

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

  socket.on("updateData", function (msg) {
    console.log("client request update: " + msg.dai + " " + msg.date);
    KetQua.find({ dai: msg.dai })
      .where("date").gt(msg.date)
      .sort("-date")
      .select("dai date ket")
      .exec(function (err, res) {
        var tmpkq = [];
        for (var i = 0; i < res.length; i++) {
          var tmp = { d: res[i].date, v: convRs(res[i].ket) }
          tmpkq.push(tmp);
        }
        var dai = res[0].dai;        
        var rs = { d: dai, kq: tmpkq };
        io.emit("returnData", rs);
        console.log("I pussed for client data: " + rs.dai + "(" + rs.kq.length + ")");
      });
  });


});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static('js'));

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
