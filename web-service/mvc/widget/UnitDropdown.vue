<!--
/**
* @file 自助分券单元选择
* @author ll
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
* @example  1、在你需要引用代码的地方，使用 <widget-unit-dropdown v-ref:unit_dropdown></widget-unit-dropdown> 将页面引入。
* 2、当选择好资产账户的时候，有 unit-d-changed 信号发出。
* 3、可以使用getCurrentSelectCaid() 获取当前选择的acid, 如果没有选择，返回为''
* 4、根据资产管理人更新界面接口为 updateDropdownList(maid), 如：updateDropdownList('000008')
*/
-->
<template style="float: left;">
    <div class="ui floating labeled icon dropdown button js-unit-d" style="z-index:100">
       <i class="dropdown icon"></i>
       <span class="text">请选择自助分券单元</span>
       <div class="menu">
           <div class="item" v-for="caid in model">
               <span class="text">{{ caid.caname }}</span>
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
    var sql = "select a.acid, a.caid, a.acname, b.caname from taact a, tacap b where a.`caid` = b.`caid` and  a.`maid` = '"+ 9+ "'  order by a.acid asc";
    console.log(sql)
    ison.db.query(sql, function(err, data) {
        var length = data.length

        var model = []
        var caidPre = ''
        var acidPre = ''

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
            var itemAcid = {acid:'', acname: '', title:''}
            itemAcid.acid = data[i].acid
            itemAcid.acname = data[i].acname
            itemAcid.title = data[i].acname + "(" + itemAcid.acid + ")"
            model[indexCaid].children[indexAcid] = itemAcid
        }
        postman(err || model)
    })
}


</script>


<script>
var currentSelectCaid = '' // 当前选择的Caid

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
    jQuery('.js-unit-d').dropdown({
        onChange: function(value, text, $choice){
        //    currentSelectCaid = value.split('(')[1].replace(')', '')
            self.$dispatch("unit-d-changed")

            console.log(value)
        },
        on: 'hover',
    })
}

/**
* @desc 更新下拉列表555
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
* @desc 获取当前选择的acid
* @author luchenqun
* @returns {String} 当前选择的acid
*/
export function getCurrentSelectCaid(){
    return currentSelectCaid
}

</script>
