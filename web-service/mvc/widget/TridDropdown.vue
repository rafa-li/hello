<!--
/**
* @file 交易单元的下拉菜单
* @author luchenqun
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
* @example  1、在你需要引用代码的地方，使用 <widget-trid-dropdown v-ref:trid_dropdown></widget-trid-dropdown> 将页面引入。
* 2、当选择好资产账户的时候，有 trid-changed 信号发出。
* 3、可以使用getCurrentSelectTrid() 获取当前选择的trid, 如果没有选择，返回为''
* 4、根据资产管理人更新界面接口为 updateDropdownList(maid), 如：updateDropdownList('000008')
* 5、根据交易单元更新插件显示接口为 updateTrid(trid),如： updateTrid('1990.101.101')
*/
-->
<template style="float: left;">
    <div class="ui floating labeled icon dropdown button js-trid"  style="z-index:100">
        <i class="dropdown icon"></i>
        <span  class="text chooseTrid">请选择交易单元</span>
        <div class="menu">
            <div class="item" v-for="caid in model">
                <i class="dropdown icon"></i>
                <span class="text">{{ caid.title }}</span>
                <div class="right menu" v-if="caid.children !== undefined">
                    <div class="item" v-for="trid in caid.children" trid="{{trid.trid}}"> {{ trid.title}} </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style type="text/css">
    .ui.floating.dropdown.button{
        margin-left: 0;
        margin-right: 16px;
    }
</style>

<script server>
/**
* @desc 获取模型
* @author luchenqun
* @param {Object} postman - 推送的数据对象
* @param {String} maid - 资产管理人
*/
export function getModel(postman, maid){
    var sql = "select a.trid, a.caid, a.trname, b.caname from tatrd a, tacap b where a.`caid` = b.`caid` and  a.`maid` = '"+ maid+"' ORDER BY a.trid";
    console.log(sql)
    ison.db.query(sql, function(err, data) {
        var length = data.length

        var model = []
        var caidPre = ''
        var tridPre = ''

        var indexCaid = -1
        var indexAcid = -1

        for(var i=0; i<length; i++){
            if(caidPre !== data[i].caid){
                indexCaid++
                caidPre = data[i].caid

                var itemCaid = {caid:'', caname: '', title:'', children:[]}
                itemCaid.caid = data[i].caid
                itemCaid.caname = data[i].caname
                itemCaid.title = data[i].caname + "(" + itemCaid.caid + ")"
                model[indexCaid] = itemCaid
                indexAcid = -1
            }

            indexAcid++
            var itemTrid = {trid:'', trname: '', title:''}
            itemTrid.trid = data[i].trid
            itemTrid.trname = data[i].trname
            itemTrid.title = data[i].trname + "(" + itemTrid.trid + ")"
            model[indexCaid].children[indexAcid] = itemTrid
        }
        postman(err || model)
    })
}
/**
* @desc 指定trid时获取交易单元名称
* @author lizhexi
* @param {Object} postman - 推送的数据对象
* @param {String} trid - 交易单元
*/
export function getTrname(postman, trid){
    var trnameSQL = "SELECT trname FROM tatrd WHERE trid = '"+trid+"'";
    var title = ''
    ison.db.query(trnameSQL,function(err,data){
        if(!err){
            console.log("data---->",data[0])
            title = data[0].trname;
            title = title+"("+trid+")"
        }else{
           console.log(err)
        }
        postman(err||title)
    })
}
</script>


<script>
var currentSelectTrid = '' // 当前选择的trid

/**
 * @func
 * @desc vue绑定数据
 * @author luchenqun
 */
export function data() {
    return {
        "model":[]
    }
}

/**
 * @func
 * @desc 初始化
 * @author luchenqun
 */
export function ready() {
    var self = this
    $('.js-trid').dropdown({
        onChange: function(value, text, $choice){
            currentSelectTrid = value.split('(')[1].replace(')', '')
            self.$dispatch("trid-changed", currentSelectTrid)
            console.log("trid-changed:", currentSelectTrid)
        },
        on: 'hover'
    })
}

/**
* @desc 更新下拉列表
* @author luchenqun
* @param {String} maid - 资产管理人
* @todo 需要考虑更新资产管理人之后，界面要更新到最开始状态
*/
export function updateDropdownList(maid){
    var self = this
    getModel(maid, function(err, receiveData){
        if(err){
            console.log(err)
        }else{
            self.model = receiveData
        }
    })
}
/**
* @desc 指定交易单元
* @author lizhexi
* @param {String} tridTitle - 交易单元及名称
* @param {String} trid      - 交易单元
*/
export function updateTrid(trid){
    console.log("trid---->",trid);
    getTrname(trid,function(err,data){
      if(err){
          console.log(err)
      }else{
         jQuery(".chooseTrid").text(data);
      }
    })

}

/**
* @desc 获取当前选择的trid
* @author luchenqun
* @returns {String} 当前选择的trid
*/
export function getCurrentSelectTrid(){
    return currentSelectTrid
}
</script>
