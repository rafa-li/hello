var fs = require("fs")
var util = require("./util.js")
var parse5 = require('parse5')
var pt = require("path")
var babel = require("babel-core")
var bundle = require("./bundle")



module.exports = function(entry, folder, test, restFolder, outputFile, watching){

    var scriptListSource = ""

    util.walk(folder).forEach(function(file){
        if(!test.test(file))
            return

        file = file.replace(/\\/g,"/")
        var fullpath = folder+"/"+file

        console.log("  compile", file)

        var parts = parseVue(fullpath)

        // rest
        if( parts.rest ) {

            var restSource = parts.rest.content
            restSource+= "\r\nexport var id = \"" + file + '"'

            var restFilepath = restFolder+"/"+file+".js"
            util.mkdirs(pt.dirname(restFilepath),0755)
            writeFile(
                restFilepath
                , compile(restSource)
            )
        }

        var source = bundle.wrapper.toString()

        // script
        if( parts.script ){
            var scriptSource = "\r\n"
                    + "if( window.__rest_index ) {\r\n"
                    + " var methodNames = window.__rest_index[require.id] || []\r\n"
                    + " for(var i=0;i<methodNames.length;i++){\r\n"
                    + "     var code = \"var \"+methodNames[i]+\" = window.app.createRestMethod(require.id,'\"+methodNames[i]+\"')\"\r\n"
                    + "     console.log(code);eval(code)\r\n"
                    + " }\r\n"
                    + "}\r\n\r\n"
                    + "// --[ "+file+" ]----------------------------------------"
                    + parts.script.content

            source = source
                .replace("/** scirpt id **/",file)
                .replace("/** scirpt here **/",compile(scriptSource,true))
        }

        // template
        function buildTemplateSource (templateNode){
            var tagName = templateNode.namedAttrs.tagname || "div"
            function escapeForTag(tagname) {
                return tagname.replace(/\-/g,"\\-")
            }
            var escapedTagName = escapeForTag(templateNode.tagName||"")
            return escape( templateNode.content
                                .replace(new RegExp("^<"+escapedTagName+"(\\b)"), "<"+tagName+"$1")
                                .replace(new RegExp("<\\/"+escapedTagName+">$"), "</"+tagName+">")
            )
        }
        if( parts.template ){
            var tplContent = 'exports.template = "' + buildTemplateSource(parts.template) + '"'
            source = source.replace("/** template here **/", tplContent)
        }

        if( parts.namedTemplates.length ){
            var tplContent = "var templates = {}\r\n"
            parts.namedTemplates.forEach((templateNode)=>{
                tplContent+= 'templates["'+escape(templateNode.namedAttrs.name)+'"] = "' + buildTemplateSource(templateNode) + "\"\r\n"
            })

            tplContent+= "exports.templates = templates\r\n"

            source = source.replace("/** named templates here **/", tplContent)
        }

        // components
        if( parts.components.length ) {
            var componentSource = "\r\n\r\n// ----------------------\r\n"
            componentSource+= "if(!exports.components) exports.components = {}\r\n"
            parts.components.forEach((componentNode)=>{
                var componentName = componentNode.componentName

                componentSource+= 'exports.components["'+ escape(componentName) +'"]'
                componentSource+= ' = { \r\n'
                componentSource+= '    template : "'+ buildTemplateSource(componentNode) +'"\r\n'
                componentSource+= '    , props : '+ JSON.stringify(componentNode.props) +'\r\n'
                componentSource+= '    , name : "'+ escape(componentName) +'"\r\n'

                componentSource+= '}\r\n'
            })

            source = source.replace("/** components here **/", componentSource)
        }

        //style
        source = source.replace("/** style here**/", parts.style? escape(parts.style.content): "")


        scriptListSource+= '"'+file+'": ' + source + ",\r\n"

        //
        watchFile(fullpath)
    })

    var source = "jQuery(" +
                        bundle.bundle.toString()
                            .replace("/** scirpt list here **/",scriptListSource)
                            .replace("/** entry here **/",fs.readFileSync(entry))
                    + ")"

    watchFile(entry)
    watchFile(__dirname+"/bundle.js")

    console.log("build bundle file", outputFile)
    writeFile(outputFile, source)


    function watchFile(file){
        if(watching) {
            fs.watchFile(file, {interval:300}, function(){
                watching(file)
            })
        }
    }
}

function escape(source) {
    return source
            .replace(/\\/gm,'\\\\')
            .replace(/"/gm,'\\"')
            .replace(/\r/gm,"\\r")
            .replace(/\n/gm,"\\n")
}

function compile(code,nostrict) {
    var code = babel.transform(
            code
            , {
                presets: ["es2015"]
                // , plugins: ["transform-strict-mode", {"strict":false}]
            }
    ).code

    if(nostrict) {
        code = code.replace(/["']use strict["'];/,'"no strict"')
    }

    return code
}

function parseVue(filepath) {

    var content = fs.readFileSync(filepath).toString()

    var fragment = parse5.parseFragment(content, { locationInfo: true })

    var output = {
        namedTemplates: []
        , components: []
    }

    for(var i=fragment.childNodes.length-1; i>=0; i--) {
        var node = fragment.childNodes[i]
        if(node.tagName=="script" && getAttribute(node,'server')) {
            var type = "rest"
        }
        else{
            var type = node.tagName
        }

        if( !["template","script","style","rest"].includes(type) ){
            var res = /^component:(.+)$/.exec(type)
            if( res ){
                node.componentName = res[1]
                node.isComponent = true
                type = "template"
            }
            else
                continue
        }

        output[type] = {
            node: node
            // , tagHead: content.slice(node.__location.startTag.startOffset,node.__location.startTag.endOffset)
        }

        if(type=="template" ) {

            node.content = content.slice(node.__location.startOffset,node.__location.endOffset)

            node.namedAttrs = {}
            node.props = []

            if(node.attrs.length) {
                node.attrs.forEach((attr)=>{
                    node.namedAttrs[attr.name] = attr.value

                    var res = /^prop:(.+)$/.exec(attr.name)
                    if( res ){
                        node.props.push(res[1])
                    }
                })
            }

            // component
            if(node.isComponent) {
                output.components.push(node)
            }

            // named tempate
            else if( node.namedAttrs.name ){
                output.namedTemplates.push(node)
            }

            // default template
            else {
                output[type] = node
            }

        }
        else {
            output[type].content = content.slice(node.childNodes[0].__location.startOffset,node.childNodes[node.childNodes.length - 1].__location.endOffset)
        }
    }

    return output
}

function getAttribute(node, name) {
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

function writeFile(path, content) {
    if( util.md5(content)!=util.md5File(path) ) {
        fs.writeFileSync(path,content)
    }
}
