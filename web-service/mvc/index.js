// var Vue = require('vue')

window.app = {}

window.app.initComponent = function (define) {

    if( define.__inited )
        return define

    if(define.factory) {
        var tpl = define.template
        var define = define.factory()
        if( !define.template ){
            define.template = tpl
        }
    }

    if(!define.events) {
        define.events = {}
    }

    for(var key in define) {

        // hook 事件
        if(key=="ready" || key=="compiled") {
            define.events["hook:"+key] = define[key]
            delete define[key]
        }

        // 导出方法
        else if( typeof define[key]=="function" && key!="data" ) {
            if(!define.methods) {
                define.methods = {}
            }
            define.methods[key] = define[key]
            delete define[key]
        }
    }

    var style = define.style

    // ready
    var $ready = define.events["hook:ready"]
    define.events["hook:ready"] = function() {

        // style
        if(style) {
            $("<style>\r\n"+style+"\r\n</style>").appendTo(document.head)
        }

        // anchor-layout
        jQuery(this.$el).anchor("init")

        // jquery 沙盒
        var $sandbox = jQuery(this.$el)
        this.$ = function(){
            return $sandbox.find.apply($sandbox, arguments)
        }

        this.set$(this.$)

        if($ready) {
            return $ready.apply(this)
        }
    }

    define.__inited = true

    return define
}

window.app.loadComponentDefine = function (request) {
    var define = require(request,true)
    return window.app.initComponent(define)
}

function makeRestParams (id,method,argv){
    var params = []
    params.filefields = []
    params.files = []

    if( argv.length ){

        for(var i=0;i<argv.length;i++) {

            // 最后一个参数作为回调函数
            if( argv.length-1==i && typeof argv[i] == "function" ){
                params.callback = argv[i]
            }

            // jquery 对象
            else if( argv[i].constructor==jQuery ){
                argv[i].each(function (){
                    // 检查是否上传文件
                    if( this.type=="file" ){
                        var fieldname = this.name||"uploadfile"
                        params.filefields.push(fieldname)
                        params.files.push([fieldname, this.files[0]])
                        params.push("~file-field-holder~")
                    }
                })
            }

            // 普通参数
            else {
                params.push(argv[i])
            }
        }
    }

    return params
}

function invorkRestMethod(id,method,argv) {

    var formdata = new FormData()

    var params = makeRestParams(id,method,argv)

    if(params.filefields.length) {
        formdata.append("filefields", JSON.stringify(params.filefields))
    }
    if(params.files.length){
        params.files.forEach(function(item){
            formdata.append(item[0], item[1])
        })
    }

    formdata.append("id", id)
    formdata.append("method", method)
    formdata.append("argv", JSON.stringify(params) )

    jQuery.ajax({
        method: "POST"
        , url: "/rest"
        , data: formdata
        , contentType: false
        , processData: false
        , success: function(data){
            try{
                var ret = JSON.parse(data)
            }catch(e) {
                console.error(e)
                params.callback && params.callback(e)
                return
            }
            params.callback && params.callback(null, ret)
        }
    })
}

function invorkRestDownloadFile(id,method,argv) {
    var params = makeRestParams(id,method,argv)
    location = "/rest?id="+id+"&method="+method+"&argv=" + encodeURIComponent( JSON.stringify(params) )
}

window.app.createRestMethod = function(id,name) {
    var restFunc = function(){
        invorkRestMethod(id,name,arguments)
    }
    restFunc.downloadFile = function(){
        invorkRestDownloadFile(id,name,arguments)
    }
    return restFunc
}

// 自动将所有 vue 文件注册成为组建
window.app.transeComponentName = function (path) {
    return path
        .replace(/[\/\\]/g,"-")
        .replace(/([A-Z])/g,"-$1")
        .replace(/\-+/g,"-")
        .toLowerCase()
        .replace(/\.vue$/i,"")
}
require.keys().forEach(function(path){
    var define = require(path,true)
    Vue.component(window.app.transeComponentName(path),window.app.initComponent(define))
})

// filter
Vue.filter('JSON.stringify', JSON.stringify)
Vue.filter('JSON.parse', JSON.parse)
Vue.filter('console.log', console.log.bind(console) )

var vm = new Vue({
    el:'.app'

    , data: {
        "topview": "app-login"
    }

    , components: {
        "app-login": window.app.loadComponentDefine("app/Login.vue") ,
        "app-skeleton": window.app.loadComponentDefine("app/Skeleton.vue") ,
    }

    , events: {
        logined: function(){
            this.topview = "app-skeleton"
        }
    }
})
