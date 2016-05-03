<template>

  <a lfttop=window,10 class="btn-sidebar ui button circular icon"><i class="sidebar icon"></i></a>
  <div class="ui inverted labeled left inline vertical sidebar left-sidebar menu">
    <a class="logo"><img src="images/logo.png"></a>
  </div>

</template>

<style type="text/css">
    .btn-sidebar.ui.icon{
        position: fixed !important;
    }
</style>

<script>
    export function ready() {
    
        var self = this
    
        // 禁用 error 输出
        var stderr = console.error ; console.error = function(){}
    
        // 初始化左侧菜单
        this.$sidemenu = $('.left-sidebar')
            .sidebar("setting","onHidden", function(){
                jQuery.anchor("loop-once")
            })
            .sidebar('attach events', '.btn-sidebar')
    
        // 恢复 error 输出
        console.error = stderr
    
        // 挂载其他组件
        require.keys().forEach(function(path){
            var define = require(path,true)
            define = window.app.initComponent(define)
            if( define.methods && define.methods.registerSideMenu ){
                define.methods.registerSideMenu.apply(define,[self])
            }
        })
    }
    
    function createSubMenu($item) {
        $submenu = $item.find("div.menu")
        return $submenu.size()?
                    $submenu :
                    jQuery('<div class="menu"></div>').appendTo($item)
    }
    
    export function registerItem(path, options) {
    
        var self = this
    
        if(!options) options = {}
        var arrPath = path.split('/')
            .filter(function(val){ return !! val })
        var itemName = arrPath.pop()
    
        if(!itemName) return
    
        var $menu = this.$sidemenu
        arrPath.forEach(function(parentName){
            $parent = $menu.find(".item-" + parentName)
            if(!$parent.size()) {
                $menu = null
                console.error("unknow item name:", parentName, ", for", path)
                return
            }
            $menu = createSubMenu($parent)
        })
    
        if( !$menu ){
            return
        }
    
        $item = jQuery(
            '<div class="item-'+itemName+'">'
            + ' <a class="item">'
            + '     <i class="layout icon"></i>'
            + '     <span class=title>'+(options.title||itemName)+'</span>'
            + ' </a>'
            + '</div>'
        ).appendTo($menu)
    
        if(options.icon) {
            if(options.icon.forEach) {
                options.icon.forEach(function(className){
                    $item.find("i.icon").addClass(className)
                })
            }
            else
                $item.find("i.icon").addClass(options.icon)
        }
    
        if(options.click && typeof options.click=="function")
            $item.find("a.item").click(function(){
                options.click.apply(this,[function(){
                    // 关闭侧边菜单
                    self.$sidemenu.sidebar("hide")
                }])
            })
    
        if( options.component ){
            $item.find("a.item").click(function(){
                self.$dispatch("active-component", options.component)
                self.$sidemenu.sidebar("hide")
            })
        }
    
    }
</script>
