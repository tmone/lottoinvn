
var socket = io();
$('form').submit(function () {
    //socket.emit('chat message', $('#m').val());
    //$('#m').val('');
    updateData($('#tinh').val());
    return false;
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

$('#tinh').change(function() {    
    var ti = this.value;
    console.log(ti);
    updateData(ti);
});

function updateData(pro){
    var last = getMaxLocalDate(pro);
    var data = {dai:pro,date:last};
    socket.emit("updateData",data);    
}
socket.on("returnData",function(msg){
    var ti = msg.dai;
    var id = idLocalData(ti);
    var lo = localStorage.LottownData[id];
    lo.kq = lo.kq.concat(msg.kq);
});

function findData(pro){
    var rs;
    for(var i = 0; i<localStorage.LottownData.length;i++){
        if(localStorage.LottownData[i].dai==pro){
            return i;
        }
    }
    var tmp = {dai:pro,kq:[]};
    localStorage.LottownData.push(tmp);
    return localData.LottownData.length - 1;
}

function idLocalData(pro){
    var rs = 0;
    if(localStorage.LottownData){
        rs = findData(pro);
    }else{
        localStorage.LottownData = [];
        var tmp = {dai:pro,kq:[]};
        localStorage.LottownData.push(tmp);        
    }
    return rs;
};

function getMaxLocalDate(pro){
    var rs = new Date('2000-01-01');
    if (localStorage.LottownData) {        
        for(var i = 0; i<localStorage.LottownData.length;i++){
            if(localStorage.LottownData[i].p==pro){
                var kq = localStorage.LottownData[i].kq;
                if(kq.length>0)
                    return kq[0].d;
            }
        }
    }
    return rs;
}