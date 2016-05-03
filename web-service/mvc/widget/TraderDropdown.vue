<!--
/**
* @file 交易单元的下拉菜单
* @author luchenqun
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
* @example  1、在你需要引用代码的地方，使用 <widget-trader-dropdown v-ref:trader_dropdown></widget-trader-dropdown> 将页面引入。
* 2、当选择好交易单元或者交易员的时候，有 trader-changed 信号发出。
* 3、可以使用getCurrentSelectTrid() 获取当前选择的trid, 如果没有选择，返回为'', getCurrentSelectTrader() 获取当前选择的trader, 如果没有选择，返回为''
* 4、根据资产管理人更新界面接口为 updateDropdownList(maid), 如：updateDropdownList('000008')
*/
-->
<template style="float:left">
    <div class="ui floating labeled icon dropdown button js-trader"  style="z-index:100">
        <i class="dropdown icon"></i>
        <span class="text js-selected">请选择交易单元或者交易员</span>
        <div class="menu">
            <div class="item" v-for="trid in model">
                <i class="dropdown icon"></i>
                <span class="text" trid="{{trid.trid}}" trader-id="">{{ trid.title }}</span>
                <div class="right menu" v-if="trid.children !== undefined">
                    <div class="item" v-for="trader in trid.children" trader-id="{{trader.traderid}}" trid="{{trid.trid}}"> {{ trader.title}} </div>
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
    var sql = "select c.traderid, tp.oname, a.trid, a.trname, a.caid, b.caname from tstrader c INNER JOIN tsoper tp ON tp.`oid` = c.`traderid` , tatrd a, tacap b where a.`caid` = b.`caid` and  a.`maid` = '" + maid + "' and c.trid = a.trid ORDER BY a.trid";
    console.log(sql)
    ison.db.query(sql, function(err, data) {
        var length = data.length

        var model = []
        var tridPre = ''
        var traderPre = ''

        var indexTrid = -1
        var indexTrader = -1

        for (var i = 0; i < length; i++) {
            if (tridPre !== data[i].trid) {
                indexTrid++
                tridPre = data[i].trid

                var itemTrid = {
                    caid: '',
                    trid: '',
                    trname: '',
                    title: '',
                    children: []
                }
                itemTrid.caid = data[i].caid
                itemTrid.trid = data[i].trid
                itemTrid.trname = data[i].trname
                itemTrid.title = data[i].trname + "(" + itemTrid.trid + ")"
                model[indexTrid] = itemTrid
                indexTrader = -1
            }

            indexTrader++
            var itemTrader = {
                caid: '',
                trid: '',
                traderid: '',
                oname: '',
                title: ''
            }
            itemTrader.caid = data[i].caid
            itemTrader.trid = data[i].trid
            itemTrader.traderid = data[i].traderid
            itemTrader.oname = data[i].oname
            itemTrader.title = data[i].oname + "(" + itemTrader.traderid + ")"
            model[indexTrid].children[indexTrader] = itemTrader
        }
        postman(err || model)
    })
}
</script>


<script>
var currentSelectTrid = ''      // 当前选择的 trid
var currentSelectTrader = ''    // 当前选择的 trader

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
    jQuery('.js-trader').dropdown({
        on: 'hover',
        allowCategorySelection: true,
        onChange: function(value, text, $choice){
            if((typeof jQuery($choice).attr("trid") === 'undefined') && (typeof jQuery($choice).attr("trid") === 'undefined')){
                currentSelectTrid = (value.split('(')[1]).split(')')[0]
                currentSelectTrader = ''
            } else {
                currentSelectTrid = jQuery($choice).attr("trid")
                currentSelectTrader = jQuery($choice).attr("trader-id")
            }
            console.log(currentSelectTrid, currentSelectTrader)
            self.$dispatch("trader-changed", currentSelectTrid, currentSelectTrader)
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

/**
* @desc 获取当前选择的Trader
* @author luchenqun
* @returns {String} 当前选择的Trader
*/
export function getCurrentSelectTrader(){
    return currentSelectTrader
}
</script>
