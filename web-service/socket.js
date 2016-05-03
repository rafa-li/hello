var fs = require("fs")

var sockets = {}
var dir =  './sockets'
fs.readdirSync(dir).forEach(function(filename){
    var path = dir+'/'+filename
    var stat = fs.statSync(path)
    if (stat && stat.isFile()) {
        var temp = require(path)
        if(typeof temp == 'function'){
            var actor_name = filename.split('.')[0]
            sockets[actor_name] = require(path)
        }
    }
})

function createOn(socket,io,actor_name){
    socket.on(actor_name,function(data){
        //var req = {}
        var res = {}
        //req.data = data
        //req.id = socket.client.conn.id
        var real_actor_name = actor_name
        
        res.send = function(){
            var send_data = ''
            if(arguments.length == 2){
                real_actor_name = arguments[0]
                send_data = arguments[1]
            }else if(arguments.length == 1){
                send_data = arguments[0]
            }
            io.emit(real_actor_name,send_data)
        }
        res.reply = function(){
            var send_data = ''
            if(arguments.length == 2){
                real_actor_name = arguments[0]
                send_data = arguments[1]
            }else if(arguments.length == 1){
                send_data = arguments[0]
            }
            socket.emit(real_actor_name,send_data)
        }
        res.err = function(){
            var send_data = ''
            if(arguments.length == 2){
                real_actor_name = arguments[0]
                send_data = arguments[1]
            }else if(arguments.length == 1){
                real_actor_name = 'err'
                send_data = arguments[0]
            }
            socket.emit(real_actor_name,send_data)
        }
        sockets[actor_name].call(this,data,res)
    })
}
function createOns(socket,io){
    for(var o in sockets){
        var temp = sockets[o]
        createOn(socket,io,o)
    }
}

exports.init = function(io){
    io.on('connection', function(socket) {
        createOns(socket,io)
    });
}


if( Date.prototype.format !== "function" )
{
    //日期格式化
    Date.prototype.format =function( formatStr )
    {
        var str = formatStr

        str = str.replace(/yyyy|YYYY/,this.getFullYear())
        str = str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));
        str = str.replace(/MM/,this.getMonth() >8?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));
        str = str.replace(/M/g,this.getMonth());

        str = str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
        str = str.replace(/d|D/g,this.getDate());
        str = str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
        str = str.replace(/h|H/g,this.getHours());
        str = str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
        str = str.replace(/m/g,this.getMinutes());
        str = str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
        str = str.replace(/s|S/g,this.getSeconds());

        return str;
    }
}
else
{
    print( "formatNum被重定义，请检查! " );
}