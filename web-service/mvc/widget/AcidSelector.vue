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
                <div v-for="item in model">
                    <div class="title"><i class="dropdown icon"></i>{{item.title}}</div>
                    <div class="content" v-if=" item.children !== undefined ">
                            <p href="#" v-for="data in item.children" class="js-acid-item" acid={{data.acid}}>
                                <a style="cursor:pointer" href="#">&nbsp&nbsp&nbsp&nbsp&nbsp{{data.title}}</a>
                            </p>
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
    var sql = "select a.acid, a.caid, a.acname, b.caname from taact a, tacap b where a.`caid` = b.`caid` and  a.`maid` = '"+ maid + "'  order by a.acid asc";
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
            console.log(value, title)
            updateList(value, self)
        }
    })

    jQuery(this.$el).on("click", ".js-acid-item", function(){
        console.log($(this).attr("acid"))
        self.$dispatch("acidClicked", $(this).attr("acid"))
        jQuery('.js-acid-item').removeClass("js-item-has-selected");
        jQuery($(this)).addClass("js-item-has-selected");
    })

    jQuery('.ui.accordion').accordion();

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
}
</script>
