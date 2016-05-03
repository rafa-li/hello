<template>
    <p class="title">资产账户列表</p>
    <div class="ui segment">
        <div class="ui fluid floating dropdown labeled search icon button js-maid-dropdown">
            <i class="world icon"></i>
            <input class="search" autocomplete="off" tabindex="0"><span class="text">选择资产管理人</span>
            <div class="menu transition hidden js-menu-maid" tabindex="-1">
                <!-- <div class="item active selected">mi(000001)</div> -->
                <div class="item js-item-maid" v-for="item in tamgrs" data-value={{item.maid}}>{{ item.maname }} ( {{item.maid}} )</div>
            </div>
        </div>
        <div>
            <div class="ui styled accordion">
                <div  v-for="item in model">
                    <div class="title"><i class="dropdown icon"></i>{{item.title}}</div>
                    <div class="content" v-if=" item.children !== undefined ">

                            <p href="#" v-for="data in item.children" class="js-trid-item" trid={{data.trid}}><a style="cursor:pointer" href="#">&nbsp&nbsp&nbsp&nbsp&nbsp{{data.title}}</a></p>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script server>
export function getMaid(postman, maid){
    var sql = "SELECT `maid`, `maname` FROM `tamgr` WHERE `maid` " + (maid == '000000' ? ("!=") : ("=")) + "'"+  maid +"' ORDER BY `maid` ASC"
    ison.db.query(sql, function(err, data) {
        postman(err || data)
    })
}

export function getList(postman, maid){
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
</script>


<script>

function updateList(maid, id){
    getList(maid, function(err, receiveData){
        if(err){
            console.log(err)
        }else{
            id.model = receiveData
        }
        console.log(receiveData)
    })
}

export function data() {
    return {
        "tamgrs":[],
        "model": null,
    }
}

export function ready() {
    var self = this
    jQuery('.ui.dropdown').dropdown({
        onChange: function(value, title, $el){
            console.log(value)
            updateList(value, self)
        }
    })

    getMaid('000000', function(err, receiveData){
        if(err){
            console.log(err)
        }else{
            self.tamgrs = receiveData
            if(receiveData.length >= 1){
                jQuery(".js-maid-dropdown .text").text(receiveData[0].maname + "(" + receiveData[0].maid +")")
                updateList(receiveData[0].maid, self)
            }
        }
    })

    jQuery(this.$el).on("click",".js-trid-item",function(){
        console.log($(this).attr("trid"))
        self.$dispatch("tridClicked", $(this).attr("trid"))
        jQuery('.js-trid-item').removeClass("js-item-has-selected");
        jQuery($(this)).addClass("js-item-has-selected");
    })

    jQuery('.ui.accordion').accordion();
}
</script>
