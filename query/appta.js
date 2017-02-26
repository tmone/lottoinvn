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

var dais = 'phu-yen';

var lasRe = null;
function getLast(l) {
    var mi = 0;
    var vl = null;
    for (var i = 0; i < l.length; i++) {
        if (Number(l[i].g) > mi) {
            mi = l[i].g;
            vl = l[i].v;
        }
    }
    return vl;
}

function exportIndex(l, r) {
    for (var i = 0; i < l.length; i++) {
        var tm = l[i].v.split("-");
        for (var j = 0; j < tm.length; j++) {
            var tmp = tm[j].trim();
            for (var k = 0; k < tmp.length; k++) {
                for (var s = 0; s < r.length; s++) {
                    if (r[s] == tmp[k]) {
                        console.log(l[i].g + '|' + j + '|' + k + '=' + s);
                    }
                }
            }
        }
    }
}

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

var rsData = [];
var ruData = [];
ruData[0] = [];
ruData[1] = [];

for(var i =0; i<81;i++){
    ruData[0][i] =0;
    ruData[1][i] =0;
}

function getMax(id) {
    var max = 0;
    var rs = 0;
    for (var i = 1; i < ruData[id].length; i++) {
        if (ruData[id][i] > max) {
            max = ruData[id][i];
            rs = i;
        }
        return rs;
    }
}

function isRuled(r) {
    for (var i = 0; i < ruData.length; i++) {
        if (ruData[i] == r)
            return true;
    }
    return false;
}



function createRule(di, ra) {
    for (var j = 0; j < ra; j++) {
        for (var i = 0; i < rsData[j].v.length; i++) {
            if (rsData[di + j].v[0] == rsData[di + 1 + j].v[i]) {
                               ruData[0][i]++;
            }
            if (rsData[di + j].v[1] == rsData[di + 1 + j].v[i]) {
                                ruData[1][i]++;
            }
        }
    }
}


function testRule(ru) {
    var vlTrue = 0;
    for (var i = 0; i < rsData.length - 1; i++) {
        var rs = rsData[i][0];
        if (runRule(ru, i + 1, rs))
            vlTrue++;
    }
    return vlTrue / rsData.length;
}
function runRule(ru, i, rs) {
    var tru = ru.split("=");
    return rsData[i][tru[0]] = rs;
}


KetQua.find({ dai: dais }, function (err, res) {
    if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
            var tmp = { d: res[i].date, v: convRs(res[i].ket) };
            rsData.push(tmp);
        }
        //console.log(rsData);
        var ra = 10;
        var di = 1;
        for (var j = 0; j < ra; j++) {
            for (var i = 0; i < rsData[j].v.length; i++) {
                if (rsData[di + j].v[0] == rsData[di + 1 + j].v[i]) {
                                ruData[0][i]++;
                }
                if (rsData[di + j].v[1] == rsData[di + 1 + j].v[i]) {
                                    ruData[1][i]++;
                }
            }
        }

        // for(var i =0; i<ruData.length;i++){
        //     console.log(ruData[i]+' : '+testRule(ruData[i]));
        // }
        var be0 = getMax(0) + '=0';
        var be1 = getMax(1) + '=1';
        console.log(be0 );
        console.log(be1 );
    }
})
    .sort({ 'date': -1 });

