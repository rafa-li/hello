<!--
/**
* @file 交易单元的下拉菜单
* @author luchenqun
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
* @example  1、在你需要引用代码的地方，使用 <widget-team-dropdown v-ref:team_dropdown></widget-team-dropdown> 将页面引入。
* 2、当选择好交易小组的时候，有 team-changed 信号发出。
* 3、getCurrentSelectTid() 获取当前选择的tid, 如果没有选择，返回为''
* 4、根据资产管理人更新界面接口为 updateDropdownList(maid), 如：updateDropdownList('000008')
*/
-->
<template style="float:left">
    <div class="ui floating labeled icon dropdown button js-team"  style="z-index:100">
        <i class="dropdown icon"></i>
        <span class="text js-selected">请选择交易小组</span>
        <div class="menu">
            <div class="item" v-for="trid in model">
                <i class="dropdown icon"></i>
                <span class="text" trid="{{trid.trid}}" trader-id="">{{ trid.title }}</span>
                <div class="right menu" v-if="trid.children !== undefined">
                    <div class="item" v-for="team in trid.children" team-id="{{team.tid}}" trid="{{trid.trid}}"> {{ team.title}} </div>
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
    var sql = "select cti.tid, cti.tname, cti.trid, a.trname from csp_team_info cti, tatrd a where cti.trid = a.trid and  a.`maid` = '"+ maid +"' ORDER BY a.trid";
    console.log(sql)
    ison.db.query(sql, function(err, data) {
        var length = data.length

        var model = []
        var tridPre = ''
        var tidPre = ''

        var indexTrid = -1
        var indexTid = -1

        for (var i = 0; i < length; i++) {
            if (tridPre !== data[i].trid) {
                indexTrid++
                tridPre = data[i].trid

                var itemTrid = {
                    trid: '',
                    trname: '',
                    title: '',
                    children: []
                }
                itemTrid.trid = data[i].trid
                itemTrid.trname = data[i].trname
                itemTrid.title = data[i].trname + "(" + itemTrid.trid + ")"
                model[indexTrid] = itemTrid
                indexTid = -1
            }

            indexTid++
            var itemTeam = {
                trid: '',
                tid: '',
                tname: '',
                title: ''
            }
            itemTeam.caid = data[i].caid
            itemTeam.trid = data[i].trid
            itemTeam.tid = data[i].tid
            itemTeam.tname = data[i].tname
            itemTeam.title = data[i].tname + "(" + itemTeam.tid + ")"
            model[indexTrid].children[indexTid] = itemTeam
        }
        postman(err || model)
    })
}
</script>


<script>
var currentSelectTid = ''    // 当前选择的 trader

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
    jQuery('.js-team').dropdown({
        on: 'hover',
        onChange: function(value, text, $choice){
            currentSelectTid = value.split('(')[1].replace(')', '')
            self.$dispatch("team-changed", currentSelectTid)
        },
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
        console.log(receiveData)
    })
}

/**
* @desc 获取当前选择的tid
* @author luchenqun
* @returns {String} 当前选择的tid
*/
export function getCurrentSelectTid(){
    return currentSelectTrid
}
</script>
