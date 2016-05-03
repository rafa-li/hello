var crypto = require('crypto')
var fs = require("fs")
var pt = require("path")

exports.removeScriptServer = function(content){

    var parse5 = require('parse5')

    var source

    var fragment = parse5.parseFragment(content, {
        locationInfo: true
    })

    for(var i=fragment.childNodes.length-1; i>=0; i--) {
        var node = fragment.childNodes[i]
        if(node.tagName!="script" || !getAttribute(node,'server'))
            continue

        var start = node.__location.startOffset
        var end = node.__location.endOffset

        var sourceStart = node.childNodes[0].__location.startOffset
        var sourceEnd = node.childNodes[node.childNodes.length - 1].__location.endOffset

        source = content.slice(sourceStart, sourceEnd)

        // 删除 <script server> 部分
        content = content.slice(0,start) + content.slice(end)
    }

    return [content, source]
}

function getAttribute (node, name) {
  if (node.attrs) {
    var i = node.attrs.length
    var attr
    while (i--) {
      attr = node.attrs[i]
      if (attr.name === name) {
        return attr.value==""? attr.name: attr.value
      }
    }
  }
}
// 创建所有目录
exports.mkdirs = function(dirpath, mode) {

    if( fs.existsSync(dirpath) ){
        return
    }

    //尝试创建父目录，然后再创建当前目录
    var parentDir = pt.dirname(dirpath)
    if( !fs.existsSync(parentDir) ){
        exports.mkdirs(parentDir, mode)
    }

    fs.mkdir(dirpath)
}

exports.walk = function(dir, _subdir) {
    var children = []
    _subdir || (_subdir = "")
    fs.readdirSync(dir).forEach(function(filename){
        var path = dir+"/"+filename
        var subpath = _subdir + filename
        var stat = fs.statSync(path)
        if (stat && stat.isDirectory()) {
            children = children.concat(exports.walk(path,subpath+"/"))
        }
        else {
            children.push(subpath)
        }
    })
    return children
}

exports.md5 = function (str) {
    var md5sum = crypto.createHash("md5")
    md5sum.update(str.toString())
    str = md5sum.digest("hex")
    return str
}
exports.md5File = function (path) {
    if( !fs.existsSync(path) ){
        return
    }
    return exports.md5(fs.readFileSync(path))
}
