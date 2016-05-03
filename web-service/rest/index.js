var fs = require("fs")
var pt = require("path")
var crypto = require('crypto')
var util = require('../vue-loader/util')

exports.middleware = function(req, res){

    req.query.__proto__ = req.body

    if( !req.query.id ){
        return res.end('{"error": "missing id"}')
    }
    if( !restbook[req.query.id] ) {
        return res.end('{"error": "path no exists"}')
    }

    if( !req.query.method ){
        return res.end('{"error": "missing method"}')
    }
    if( !restbook[req.query.id][req.query.method] ) {
        return res.end('{"error": "method no exists"}')
    }

    try{

        var argv = JSON.parse(req.query.argv) || []

        // 上传的文件
        if( req.query.filefields && req.files ) {
            var fileIdx = 0
            argv.forEach((val, idx)=>{
                if(val=="~file-field-holder~") {
                    argv[idx] = req.files[fileIdx++]
                }
            })
        }

        var postman = function(data){
            res.end( JSON.stringify(data) )
        }
        postman.outputFile = function(filedata, opt){
            if(opt){
                for(var key in opt) {
                    res.setHeader(key,opt[key])
                }
            }
            res.end(filedata, 'binary')
        }

        postman.rest = req.query.id
        postman.method = req.query.method
        postman.req = req
        postman.res = res

        postman.file = function(filebuff, opt){
            if(opt) {
                for(var key in opt) {
                    res.setHeader(key,opt[key])
                }
            }
            res.end( filebuff )
        }

        argv.unshift(postman)

        restbook[req.query.id][req.query.method].apply(null,argv)

    }catch(e) {
        console.error(e.stack)
    }
}

// 自动加载 rest 目录下的所有文件
var restindex = {}
var restbook = {}

exports.load = function (){

    restindex = {}
    restbook = {}

    util.walk(__dirname).forEach(function(filepath){
        if( filepath=="index.js" || filepath==pt.basename(__filename) ){
            return
        }

        try{
            var exports = require(__dirname+"/"+filepath)
        }catch(e) {
            console.error("rest file has err",filepath)
            console.error(e.stack)
            return
        }

        if(exports.id) {
            restindex[exports.id] = []
            restbook[exports.id] = exports

            for(var member in exports){
                if( typeof exports[member] == "function" ) {
                    restindex[exports.id].push(member)
                }
            }
        }
    })

    // 将 rest index 写入文件
    var source = "window.__rest_index = " + JSON.stringify(restindex,null,4)
    fs.writeFileSync(__dirname+"/../public/rest-index.js",source)
}
