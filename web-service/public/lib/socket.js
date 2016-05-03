function _socket(){
    this.socket = null
}
_socket.prototype.connect = function(){
    this.socket = io.connect()
    this.socket.on('disconnect', function(){
        console.log('receive disconnect event');
    })
}
_socket.prototype.on = function(data,cb){   
    this.socket.on(data,function(data){
        cb(data)
    })
}
_socket.prototype.emit = function(theme,data,cb){
    this.socket.emit(theme,data)
}
var socket = new _socket()
socket.connect()