
exports.bundle = function() {

var module_caches = {}
function _require(from, to, nocache) {

    var id = _require.resolve(from, to)
    if(!scripts[id]) {
        throw new Error("can not find file "+to)
    }

    if(!nocache && module_caches[id]) {
        return module_caches[id].exports
    }

    module_caches[id] = {
        exports: {}
        , loaded: false
        , id: id
    }

    scripts[id] ( module_caches[id].exports, createRequire(id) )

    module_caches[id].loaded = true

    return module_caches[id].exports
}
_require.resolve = function(from, to) {
    return to
}
_require.keys = function(){
    return Object.keys(scripts)
}

function createRequire(from) {
    var require = function(to, nocache){
        return _require(from, to, nocache)
    }
    require.__proto__ = _require
    require.id = from
    return require
}

var scripts = {
/** scirpt list here **/
}

var require = createRequire("")

/** entry here **/
}

exports.wrapper = function(exports,require){

var $ = null
exports.set$ = function(val){ $ = val }

/** template here **/

/** named templates here **/

exports.style = "/** style here**/"

/** scirpt here **/
/** components here **/
}
