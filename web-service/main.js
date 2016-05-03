var express = require('express');
var serveStatic = require('serve-static')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var nodeExcel = require('excel-export');
var multer = require ( 'multer' )
var fs = require("fs")
require("./es-patchs.js")
var rest = require("./rest")
require("./mvc/common/date")()
excel = require("./mvc/common/excel")
Step = require("./mvc/common/Step/Step")

// 配置文件
if(typeof ison=="undefined") ison = {}
try{
    ison.config = require("./config.json")
}catch(e) {
    if(e.code=="MODULE_NOT_FOUND") {
        ison.config = require("./config.default.json")
    }
    else {
        console.error(e)
        process.exit()
    }
}

// 自动登录
try{
    ison.login = require("./login.json")
    console.error('ison.login ', ison.login)
}catch(e) {
    if(e.code=="MODULE_NOT_FOUND") {
        ison.login = {}
    }else {
        console.error(e)
    }
}


// 自动打包
if( process.argv.includes("--dev") ){
    (function pack(watching) {
        if(watching) {
            var changedCallback = function(changeFile) {
                console.log("file changed, auto rebuild web frontend", changeFile)
                pack(false)
            }
        }
        require("./vue-loader/packer.js") (
            __dirname+"/mvc/index.js"
            , __dirname+"/mvc"
            , /\.vue$/i
            , __dirname+"/rest"
            , __dirname+"/public/mvc.js"
            , changedCallback
        )
    }) (true)
}

// 生成 rest-index.js 文件
rest.load()


// 加载数据库
require("./db.js")
if(process.argv.includes("--dev")){

}else{
require("./dbfetch.js")
}
//上传文件保存
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
       destination: function (req, file, cb) {
           cb(null, './uploadFile')
      },
    //给上传文件重命名，获取添加后缀名
     filename: function (req, file, cb) {
         var fileFormat = (file.originalname).split(".");
         cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
     }
});
// 设置 express
var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(cookieParser("An"));
app.use(session({
     secret:'an',
     maxAge:1000*60*60*24,
          resave:false,
     saveUninitialized:true
 }));
app.use('/pub', serveStatic(__dirname+'/public'))


app.get('/', function(req,res){
    res.redirect("/pub/index.html")
})

app.post(
    '/rest'
    , multer({
        storage: storage
    }).any()
    , rest.middleware
)
app.get( '/rest', rest.middleware )

var server = require('http').createServer(app)

var port = 5000
server.listen(port);
var socket = require("./socket")
var io = require('socket.io').listen(server);
socket.init(io)
console.log("\r\nlisten http://127.0.0.1:"+port)
