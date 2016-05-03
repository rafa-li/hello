<!--
/**
* @file 交易小组的下拉菜单
* @author lizhexi
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
* @example  1、在你需要引用代码的地方，使用 <widget-tid-dropdown v-ref:tid_dropdown></widget-tid-dropdown> 将页面引入。
* 2、当选择好小组的时候，有 tid-changed 信号发出。
* 3、可以使用getCurrentSelectTid() 获取当前选择的tid, 如果没有选择，返回为''
* 4、根据交易单元更新界面接口为 updateDropdownList(trid), 如：updateDropdownList('1990.101.101')
* 5、根据交易小组更新插件显示接口为 updateTid(tid),如： updateTid(2)
*/
-->
<template>
    <div class="ui floating labeled icon dropdown button js-tid"  style="z-index:100">
        <i class="dropdown icon"></i>
        <span  class="text chooseTid">请选择交易小组</span>
        <div class="menu">
            <div class="item" v-for="tid in model">
                <div class="item">{{ tid.title }} </div>
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
* @author lizhexi
* @param {Object} postman - 推送的数据对象
* @param {String} trid - 资产管理人
*/
export function getModel(postman, trid){
    var sql = "SELECT tid, tname FROM csp_team_info WHERE trid = '"+ trid+"' ORDER BY tid";
    console.log(sql)
    ison.db.query(sql, function(err, data) {
        if(!err){

        var length = data.length

        var model = []
        var indextid = -1

        for(var i=0; i<length; i++){
                indextid ++
                var itemtid = {tid:'', tname: '', title:''}
                itemtid.tid = data[i].tid
                itemtid.tname = data[i].tname
                itemtid.title = data[i].tname + "(" + itemtid.tid + ")"
                model[indextid] = itemtid

            }
        }else{
            console.log(sql,"err->",err)
        }
        postman(err || model)
    })
}
/**
* @desc 指定tid时获取交易小组名称
* @author lizhexi
* @param {Object} postman - 推送的数据对象
* @param {String} tid - 交易小组
*/
export function getTname(postman, tid){
    var tnameSQL = "SELECT tname FROM csp_team_info WHERE tid = "+tid;
    var title = ''
    ison.db.query(tnameSQL,function(err,data){
        console.log("tnameSQL---->",tnameSQL);
        if(!err){
            console.log("data---->",data[0])
            title = data[0].tname;
            title = title+"("+tid+")"
        }else{
           console.log("getTname err---->",err)
        }
        postman(err||title)
    })
}
</script>


<script>
var currentSelectTid = '' // 当前选择的tid

/**
 * @func
 * @desc vue绑定数据
 * @author lizhexi
 */
export function data() {
    return {
        "model":[]
    }
}

/**
 * @func
 * @desc 初始化
 * @author lizhexi
 */
export function ready() {
    var self = this
    $('.js-tid').dropdown({
        onChange: function(value, text, $choice){
            currentSelectTid = value.split('(')[1].split(')')[0]
            self.$dispatch("tid-changed", currentSelectTid)
            console.log("tid-changed:", currentSelectTid)
        },
        on: 'hover'
    })
}

/**
* @desc 更新下拉列表
* @author lizhexi
* @param {String} trid - 交易单元
* @todo 需要考虑更新交易单元之后，界面要更新到最开始状态
*/
export function updateDropdownList(trid){
    var self = this
    getModel(trid,function(err, receiveData){
        if(err){
            console.log("getModel err--->",err)
        }else{
            self.model = receiveData
        }
    })
}
/**
* @desc 指定交易小组
* @author lizhexi
* @param {String} tidTitle - 交易小组及名称
* @param {String} tid      - 交易小组
*/
export function updateTid(tid){
    console.log("tid---->",tid);
    if(tid !== 0){
    getTname(tid,function(err,data){
      if(err){
          console.log("getTname--->",err)
      }else{
         jQuery(".chooseTid").text(data);
      }
    })
}else{
    jQuery(".chooseTid").text("请选择交易小组");
}

}

/**
* @desc 获取当前选择的tid
* @author lizhexi
* @returns {String} 当前选择的tid
*/
export function getCurrentSelectTid(){
    return currentSelectTid
}
</script>
