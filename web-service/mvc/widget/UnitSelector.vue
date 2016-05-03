<template class="UnitSelector">
    <p class="second-title">交易单元列表</p>
    <div class="kj">
    <div class="ui segment unitlist">
        <div class="ui styled accordion js-unit-s">
            <div v-for="item in model">
                <div id={{item.trid}} flag={{$index}} class="ui title js-trid-name" ><i class="dropdown icon"></i>{{item.trname}}</div>
                    <div class="content" v-if=" item.children !== undefined ">
                        <p href="#" v-for="data in item.children" class="js-tid-item"  tid={{data.tid}} >
                            <span  class="tid-name-display" displayflag={{data.tid}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{data.tname}}</span>

                        </p>
                    </div>
            </div>
        </div>

    </div>
    </div>
</template>
<style>
    .UnitSelector{
        height: 100%
    }
    .ui.segment.unitlist{
        border: 0;
        box-shadow: none;

    }
    .ui.accordion {
        margin-top: 0px;
    }
    .kj{
        overflow-y:scroll;
        margin-top:1.5em;
        height:85%;
        width: 280px;
        border: solid 1px #dedede;
        border-radius:5px
    }

    .tid-name-display{
        color: #1818BF;
    }
    .second-title{

        font-size: 1.2em;
    }
    .ui.title.js-trid-name{
        height: 25px;

    }
    .tname-choosen{
        color: #f2711c;
    }
</style>


<script server>
export function getList(postman, maid){

        var sql = "select b.trid,b.trname,a.tid,a.tname from csp_team_info a INNER JOIN "+"("+"select trid,trname from tatrd where maid = "+"'"+maid+"'"+")"+ "as b on a.trid=b.trid order by trid Asc,tid asc"

        ison.db.query(sql, function(err, data) {
            var length = data.length
            var model = []
            var tridPre = ''
            var indexTrid = -1
            var indexTid = -1
            for (var i = 0; i < length; i++) {
                if (tridPre !== data[i].trid) {
                    indexTrid++
                    tridPre = data[i].trid
                    var itemTrid = {
                        trid: '',
                        trname: '',
                        children: []
                    }
                    itemTrid.trid = data[i].trid
                    itemTrid.trname = data[i].trname
                    model[indexTrid] = itemTrid
                    indexTid = -1
                }

                indexTid++
                var itemTid = {
                    tid: '',
                    tname: '',
                }
                itemTid.tid = data[i].tid
                itemTid.tname = data[i].tname
                model[indexTrid].children[indexTid] = itemTid
            }
            postman(err || model)
        })

}
</script>


<script>
export function data() {
    return {
        "model": null,
    }
}


export function ready() {
    var self = this;
    jQuery(this.$el).on("mouseenter", ".tid-name-display", function(){
        $(this).addClass("tname-choosen");
    })
    jQuery(this.$el).on("mouseleave", ".tid-name-display", function(){
        $(this).removeClass("tname-choosen");
    })

    jQuery(this.$el).on("click", ".js-tid-item", function(){
         console.log($(this).attr("tid"))
        self.$dispatch("unit-s-changed", $(this).attr("tid"))
        // // self.$dispatch("acidClicked", $(this).attr("acid"))
        // jQuery('.js-tid-item').removeClass("js-item-has-selected");
        // jQuery($(this)).addClass("js-item-has-selected");
        // self.$dispatch("unit-s-changed", $(this).attr("acid"))
    })

    jQuery('.ui.accordion').accordion();
}

/**
* @desc 更新下拉列表
* @author luchenqun
* @param {String} maid - 资产管理人
* @todo 需要考虑更新资产管理人之后，界面要更新到最开始状态
*/
export function updateSelectorList(maid){
    var self = this
    getList(maid, function(err, receiveData){
        if(err){
            console.log(err)
        }else{
            self.model = receiveData
        }
        // console.log("mmmmmmmmmm",receiveData)
    })
}

</script>
