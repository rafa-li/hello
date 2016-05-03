// data
var dbTable = {};

dbTable._1 = {
    dbName: 'ta_hold',
    column_1:'lasttm',
    sybl:'>'
};

dbTable._2 = {
    dbName: 'taact_order',
    column_1:'tradetm',
    sybl:'>'
};

if(!ison.tgw) {
    ison.tgw = {};
    ison.tgw.init = function(){};
    ison.tgw.send = function(){};
    ison.tgw.login = function(){};
    ison.tgw.receive = function(){};

    ison.tgw.addIndex = function(){};
    ison.tgw.rmIndex = function(){};
    ison.tgw.cleanIndex = function(){};
    ison.tgw.sendIndex = function(){};
};

var db = ison.db;
var tgw = ison.tgw;
ison.tgw.init();

var testsub = function (){

    tgw.addIndex('000300', 102);// IF
    tgw.addIndex('399905', 102);// IC
    tgw.addIndex('999987', 102);// IH

    tgw.sendIndex(102);

    var ps = {};

    ps = ison.tgw.receive('index', 102, function(topic, pdata){
        console.log('receive in index', topic);
    });

    tgw.send('getFutureID', {body:{}}, function(redata){

        console.log("getFutureID2",JSON.stringify(redata));

        var count_if = 0;
        var count_ih = 0;
        var count_ic = 0;


        if(redata && redata.length > 0){

            for(var i =0;i<redata.length;i++){

                var code = redata[i].code;

                console.log("getFutureID",code,code.substr(0,2),code.substr(2,4));

                if(code.substr(0,2)=="IF" && count_if<4){
                    count_if++;
                    tgw.addCtp("90" + code.substr(2,4), 102)
                }
                else if(code.substr(0,2)=="IH" && count_ih<4){
                    count_ih++;
                    tgw.addCtp("91" + code.substr(2,4), 102)
                }
                else if(code.substr(0,2)=="IC" && count_ic<4){
                    count_ic++;
                    tgw.addCtp("92" + code.substr(2,4), 102)
                }
            }
        }

        tgw.sendCtp(102);
    });


    ps = ison.tgw.receive('ctp', 102, function(topic, pdata){
        console.log('receive in ctp', topic, pdata);
    });

}

var testSubLevel2 = function(){
    tgw.addLevel2('000001', 102);
    tgw.addLevel2('600446', 102);

    tgw.sendLevel2(102);

    setTimeout(function(){ison.tgw.receive('ctp', 102, function(topic, pdata){
        console.log('receive in ctp', pdata);
    })}, 3*1000);
}

//testsub();

//setTimeout(testSubLevel2, 10*1000);

var syncWebData = function(cb){

    for(var o in dbTable){
        var _o = dbTable[o];
        // get max lasttm from web database
        var sql = "SELECT DATE_FORMAT(max(" + dbTable[o].column_1+"), '%Y-%m-%d %T') AS maxVal FROM " + dbTable[o].dbName;
        var testRet = db.query(sql, syncWebData.cb(_o));
    }

    cb();
};

syncWebData.cb = function(_o){

    return function(err, rows){

        if(typeof rows == 'undefined' || rows.length == 0)
            return;

        sql = "SELECT * FROM "+ _o.dbName +" WHERE " + _o.column_1+_o.sybl +"'"+ rows[0].maxVal + "'";

        var body = {body:{}};
        body.body.sql = sql;

        tgw.send('db/Query', body, function(data){
            if(data && data.rows && data.rows.length > 0)
                dbfetchHelp.insertArray(_o.dbName, data.rows);
        });
    }
};

var interval = 60*1000;// sync time

syncWebData(function(){});

(function scheduleFetchData() {
    setTimeout(function do_it() {
        syncWebData(function() {
            scheduleFetchData();
        });
    }, interval);
}());

if( typeof dbfetchHelp=="undefined" ){
    var dbfetchHelp = {};
};

dbfetchHelp.insertArray = function(tablename, data){
    var fields = [];
    for(var i = 0; i < data.length; i++){
        var data_i = data[i];
        for(var o in data_i){
            if(fields.indexOf(o) == -1){
                fields.push(o);
            }
        }
    }

    var block = 1000;
    var nT = Math.ceil(data.length/block);
    for(var i = 0; i < nT-1; ++i){
        dbfetchHelp.insertBlock(tablename, data.slice( block*i, block*(i+1)), fields);
    }

    var nLeft = data.length - (nT-1)*block;
    if(nLeft > 0){
        dbfetchHelp.insertBlock(tablename, data.slice((nT-1)*block), fields);
    }
};

dbfetchHelp.insertBlock = function(tablename, data, fields){
    var arrayValues = [];
    for(var i = 0; i < data.length; i++){
        var values = new Array(fields.length);
        var data_ii = data[i];
        for(var j = 0; j < fields.length; ++j){
            var ofield = fields[j];
            if(data_ii[ofield] == undefined){
                var vNull = "'default'";
                values[j] = (vNull);
            }else{
                if( typeof data_ii[ofield] == "number" ){
                    values[j] = ( data_ii[ofield] );
                }else{
                    values[j] = ( data_ii[ofield].replace(/\\/gm,"\\\\").replace(/\"/gm,"\\\"").replace(/\'/gm, "\'\'") );
                }
            }
        }
        arrayValues.push("('" + values.join("','") + "' )");
    }

    var sql = "insert ignore INTO `" + tablename + "` (`" + fields.join("`,`") + "`) VALUES " + arrayValues.join(", ");
    // 替换没有的值为默认值
    sql = sql.replace(/''default''/g, 'DEFAULT');
    //console.log(("[" + (new Date).toString().substr(0,24) + "] "), sql);
    db.query(sql, dbfetchHelp.cb(sql));
};

dbfetchHelp.cb = function(sql) {
    var _sql = sql;
    return function(err, rows){
        if (err){
            console.log(_sql);
            console.log(JSON.stringify(err));
            return;
        }
    }
};



//var testLogin = function(){
//    var loginbDate = new Date();
//    console.log(("[" + (new Date).toString() + "] "));
//    ison.tgw.login('5','5.lirf', '888888', 99, function(){
//        console.log('login ALl TIme:', loginbDate.getTime() - (new Date()).getTime());
//    });
//};

//setTimeout(testLogin, 1000);
