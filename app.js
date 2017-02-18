var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://z500.top:27017/rawlot');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var rsLotSchema = mongoose.Schema({
    dai: String,
    ngay: String,    
    ket: []
});



var cachResult = [];
var KetQua = mongoose.model('KetQua', rsLotSchema);

function KQ(n,d,k){
    this.Dai = d;
    this.Ngay = n;
    this.Ket = k;
}
KQ.prototype.AddKq = function(n){
    this.Kq = n;
}
KQ.prototype.Save = function(){
    KetQua.findOneAndUpdate({dai:this.Dai,ngay:this.Ngay},{ket:this.Ket},{upsert:true},function(err,res){
        //var c = res._doc;
        //console.log("saved!"+c.ngay+':'+c.dai);
    });
}



var Crawler = require("crawler");
var url = require('url');

var dsDai = [];

function isExistDai(d){
    
    for(var i = 0; i< dsDai.length;i++){
        if(dsDai[i].Dai == d)
            return dsDai[i];
    }
    return null;
}
function isExistNgay(d,n){
    var ds = isExistDai(d);
    if(ds){
        for(var i = 0; i<ds.Ngay.length;i++)
            if(ds.Ngay[i]==n)
                return true;
    }
    return false;
}

function findOutOld(str){
    var tmp = isExistDai(str);
    if(tmp==null){
        tmp = {Dai:str,Ngay:[]};
        dsDai.push(tmp);
    } 
    KetQua.find({dai:str},function(err,res){
        for(var i =0; i<res.length;i++){
            var tmpNgay = isExistNgay(str,res[i]._doc.ngay);
                    if(!tmpNgay){
                        tmp.Ngay.push(res[i]._doc.ngay);                        
                    }

        }
    });
}

var c = new Crawler({
    maxConnections : 1,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            var selectDai = null;
            var selectNgay='';
            var listDai = $('#box_kqxs_tinh option');
            for(var i=0; i<listDai.length;i++){
                var va = listDai[i].attribs.value;
                var tmp = isExistDai(va);
                if(tmp==null){
                    tmp = {Dai:va,Ngay:[]};
                    dsDai.push(tmp);
                    addQueues(va);

                }                    
                if(va == $('#box_kqxs_tinh option:selected').val())
                    selectDai = tmp;
            }
            
            if(selectDai){
                var listNgay = $('#box_kqxs_ngay option');
                for(var i=0; i<listNgay.length;i++){
                    var va = listNgay[i].attribs.value;
                    var tmp = isExistNgay(selectDai.Dai,va);
                    if(!tmp){
                        selectDai.Ngay.push(va);
                        addQueue(selectDai.Dai,va);
                    }
                    if(va==$('#box_kqxs_ngay option:selected').val())
                        selectNgay =va;
                }
                var li = [];
                for(var i=0;i<9;i++){
                    var t = i;
                    if(i==0)
                        t = 'db';
                    var l = '.giai'+t;
                    var gt = $(l).text().trim();
                    var tmp = {g:t,v:gt};
                    li.push(tmp);
                }
                var newKQ = new KQ(selectNgay,selectDai.Dai,li);
                newKQ.Save();           
                //console.log('saved!'+selectDai.Dai+':'+selectNgay);
                //io.emit('chat message', selectDai.Dai+':'+selectNgay);
                io.emit('complite',c.queueSize+'#'+selectDai.Dai+'#'+selectNgay);
            }

        }
        done();

    },
    
});
c.on('drain',function(){
    //io.emit('complite','0##');
    var d = new Date();
    d = d.addHours(1)
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    io.emit('complite','1#Update#All update all. will run at '+h+':'+m+':'+s);
    setTimeout(function() {
        addQueues('mien-bac');    
    }, 3600000);

});

function addQueue(d,n){
    c.queue('http://www.minhngoc.com.vn/getkqxs/' + d+ '/'+ n+ '.js');
    //io.emit('add',d+'#'+n);
}
function addQueues(d){
    //findOutOld(d);
    c.queue('http://www.minhngoc.com.vn/getkqxs/' + d+'.js');
    //io.emit('init',d);
}

//c.connection.


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    addQueues(msg);    
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.emit('complite','1#Init#Preparing...');


var tinh = new Array();
tinh[1] = ["da-lat", "khanh-hoa", "kien-giang", "kon-tum", "mien-bac", "tien-giang"];
tinh[2] = ["ca-mau", "dong-thap",  "phu-yen", "thua-thien-hue", "tp-hcm"];
tinh[3] = ["bac-lieu", "ben-tre", "dak-lak", "quang-nam", "vung-tau"];
tinh[4] = [ "can-tho", "da-nang", "dong-nai", "soc-trang"];
tinh[5] = ["an-giang", "binh-dinh", "binh-thuan",  "quang-binh", "quang-tri", "tay-ninh"];
tinh[6] = ["binh-duong", "gia-lai",  "ninh-thuan", "tra-vinh", "vinh-long"];
tinh[7] = ["binh-phuoc",  "dak-nong", "hau-giang", "long-an", "quang-ngai"];

for(var i=0;i<tinh.length;i++){
    var spl = tinh[i];
    for(var j=0;j<spl;j++){
        findOutOld(spl[j]);
    }
}

setTimeout(function() {
    addQueues('mien-bac');    
}, 360000);