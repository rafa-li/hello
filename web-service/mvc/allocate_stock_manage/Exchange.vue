<!--
/**
 * @file 小组换券
 * @author zf Luke
 * @version 1.0
 * @copyright 2016 All Right Reserved @ LeHighHongking
 */
-->
<template class="Exchange">
<div class="ui medium header"> 小组换券 {{tname}}</div>
<div class="data-container lk">
    <p class="info"><span>分券市值：{{pre_value}}</span><span>当前市值：{{post_value}}</span><span>BP：{{bp}}</span></p>
    <div class="data left">
        <p class="title">我的券单</p>
        <div class="table-container lk">
            <table  id="js-my-stocks-table" class="ui single line selectable striped table">
                <thead id="fix-header">
                    <tr>
                    <th>序号</th>
                    <th>证券代码</th>
                    <th>证券名称</th>
                    <th>分券数量<br> 分券市值</th>
                    <th>当前数量<br> 当前市值</th>
                    <th class="three wide center aligned">状态</th>
                    </tr>
                </thead>
                <tbody id="js_left_column">
                    <tr v-for="item in myStocks | orderBy 'style_stat' -1 'cindex'  -1" key={{item.key}} id={{item.code}} code={{item.code}} tid={{item.tid}} :class="stats[item.style_stat].class">
                        <td>{{item.cindex}}</td>
                        <td>{{item.code}}</td>
                        <td>{{item.cname}}</td>
                        <td>{{item.post_allocated_amount}}<br> {{item.post_allocated_value}}</td>
                        <td>{{item.post_exchange_amount}}<br> {{item.post_exchange_value}}</td>

                        <td class="left aligned" v-if="item.style_stat == 3"><i class="large info circle icon"></i>{{askedExchange[item.key].length}}{{stats[item.style_stat].name}}</td>
                        <td class="left aligned" v-if="item.style_stat == 1"><i class="large check circle outline icon"></i>{{stats[item.style_stat].name}}</td>
                        <td class="left aligned" v-if="item.style_stat == 2"><i class="large time icon"></i>{{stats[item.style_stat].name}}</td>
                        <td class="left aligned" v-if="item.style_stat == 0"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- <div class="ui success message">
          <i class="close icon"></i>
          <div class="header">你的用户注册已成功。 </div>
          <p>现在你可以用你选择的用户名登录了</p>
        </div> -->

        <div class="js_asked_list custom popup top left transition hidden">
            <div class="ui success message">
                <div class="handle lk bottom box" v-for="item in askedExchangeTemp">
                    <span>{{item.ask_tname}}想用{{item.ask_cname}}（{{item.ask_volume}},{{item.ask_value}}）和你换{{item.asked_cname}}（{{item.asked_volume}},{{item.asked_value}}）</span>
                    <button class="ui button cancel" v-on:click="refuseAsk(item.asked_tid+'||'+item.asked_code,item.id)"><i class="tiny close icon"></i> 拒绝 </button>
                    <button class="ui primary button" v-on:click="askConfirm(item.asked_tid+'||'+item.asked_code,item.id)"><i class="tiny inverted checkmark icon"></i> 同意 </button>
                </div>
            </div>
        </div>
    </div>
    <div class="data right" id="js_right_column">
        <p class="title">公共券池</p>
<!--     <div v-for="item in askExchangeList">
        <span>{{item.ask_tname}}想用{{item.ask_cname}}（{{item.ask_volume}},{{item.ask_value}}）和 {{item.asked_tname}}   换{{item.asked_cname}}（{{item.asked_volume}},{{item.asked_value}}）</span>
    </div> -->
        <div class="table-container lk">
            <table id="js-expect-stocks-table" class="ui selectable striped center aligned table">
                <thead id="fix-header">
                    <tr>
                    <th>序号</th>
                    <th>小组名称</th>
                    <th>证券代码</th>
                    <th>证券名称</th>
                    <th>数量</th>
                    <th>市值</th>
                    <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row red font" v-for="item in expectExchangeList" key={{item.key}}>

                        <td>{{item.cindex}}</td>
                        <td>{{item.tname}}</td>
                        <td>{{item.code}}</td>
                        <td>{{item.cname}}</td>
                        <td>{{item.post_exchange_amount}}</td>
                        <td>{{item.post_exchange_value}}</td>
                        <td v-on:click="cancelExchange(item.key)">撤销</td>
                    </tr>
                    <tr class="row" v-for="item in otherExpectExchangeList" key={{item.key}}>
                        <td>{{item.cindex}}</td>
                        <td>{{item.tname}}</td>
                        <td>{{item.code}}</td>
                        <td>{{item.cname}}</td>
                        <td>{{item.post_exchange_amount}}</td>
                        <td>{{item.post_exchange_value}}</td>
                        <td class="blue font" v-on:click="exchangeStock(item.key)">申请换券</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>


<div class="ui inverted dimmer js-update-view">
    <div class="ui text loader">正在更新界面...</div>
</div>

<div class="ui modal js_exchange">
    <i class="close icon"></i>
    <div class="header">申请换券</div>
    <form class="ui form content js_ask_exchange">
        <p>向 {{target.tnames}} 申请换券：</p>
        <p>用</p>
        <div class="three fields inline">
            <div class="four wide field">
                <label>证券代码/名称：</label>
            </div>
            <div class="field lk">
                <input type="text" name="ask_code" id="myStockCode"  v-model="askExchangeItem.ask_code"  value={{askExchangeItem.ask_code}} />
            </div>
            <div class="field lk">
                <input type="text" name="ask_cname"  value={{source.cname}} disabled />
            </div>
        </div>
        <div class="three fields inline">
            <div class="four wide field">
                <label>数量/市值：</label>
            </div>
            <div class="field lk">
                <input type="text" id="myStockVolume"  name="ask_volume"  v-model="askExchangeItem.ask_volume" debounce="500" value={{askExchangeItem.ask_volume}} />
            </div>
            <div class="field lk">
                <input type="text" id="ask_value" name="ask_value" value={{askExchangeItem.ask_value}} disabled />
            </div>
        </div>
        <p>换取</p>
        <div class="three fields inline">
           <div class="four wide field">
                <label>证券代码/名称：</label>
            </div>
            <div class="field lk">
                <input type="text" name="asked_code" value={{target.code}} disabled />
            </div>
            <div class="field lk">
                <input type="text" name="asked_cname" value={{target.cname}} disabled />
            </div>
        </div>
        <div class="three fields inline">
            <div class="four wide field">
                <label>数量/市值：</label>
            </div>
            <div class="field lk">
                <input type="text" name="asked_volume" v-model="askExchangeItem.asked_volume" debounce="500" value={{askExchangeItem.asked_volume}} />
            </div>
            <div class="field lk">
                <input type="text" name="asked_value" v-model="askExchangeItem.asked_value" debounce="500" value={{askExchangeItem.asked_value}} />
            </div>
        </div>
    <div class="ui error message"></div>
    <div class="actions">
        <div class="ui primary button submit">申请换券</div>
        <div class="ui cancel button" v-on:click="cancel_ask()">取消</div>
    </div>
    </form>

</div>

<table class="ui single line selectable striped table temp_container"></table>
<div class="ui modal small js_err_info">
    <i class="close icon"></i>
    <div class="header">操作失败</div>
    <div class="content">
        {{errInfo}}
    </div>
    <div class="actions">
        <div class="ui cancel button">取消</div>
    </div>
</div>

</template>




<script>

var currentItem = {}


export function exchangeStock(value){
    var self = this

    var myStock = self.getExchangeStock()
    self.source = myStock

    self.update_module_info('ask',myStock)

    var target = get_item_from_array_by_key(self.otherExpectExchangeList,['key'],value)
    self.target = target

    self.update_module_info('asked',target)

    jQuery('.js_exchange').modal('show');
}

export function update_module_info(type,info){
    var self = this
    if(info){
        self.askExchangeItem[type+'_tname'] = info.tname
        self.askExchangeItem[type+'_code'] = info.code
        self.askExchangeItem[type+'_tid'] = info.tid
        self.askExchangeItem[type+'_cname'] = info.cname
        self.askExchangeItem[type+'_price'] = info.preclose || 0
    }else{
        self.askExchangeItem[type+'_tname'] = ''
        self.askExchangeItem[type+'_code'] = ''
        self.askExchangeItem[type+'_tid'] = ''
        self.askExchangeItem[type+'_cname'] = ''
        self.askExchangeItem[type+'_price'] = ''
    }
}

export function clear_asked_list(data){
    for(var o in data){
        var item = data[o]
        this.clear_asked(item.tid+'||'+item.code)
    }

}
export function clear_asked(key){
    if(this.askedExchange[key]){
        this.askedExchange[key] = []
    }

}
export function clear_ask(key){
    return delete_item_from_array_by_key(this.askExchangeList,['asked_tid','asked_code'],key,true)
}
export function clear_ask_list(data){
    for(var o in data){
        var item = data[o]
        var key = item.tid+'||'+item.code
        delete_item_from_array_by_key(this.askExchangeList,['ask_tid','ask_code'],key,true)
        delete_item_from_array_by_key(this.askExchangeList,['asked_tid','asked_code'],key,true)
    }
}
export function delete_from_ask_list(data){
    delete_item_from_array_by_key(this.askExchangeList,['id'],data.id)
}
export function clear_expect_list(data){
    for(var o in data){
        var item = data[o]
        this.delete_from_right_top(item.tid+'||'+item.code)
        this.delete_from_right_bottom(item.tid+'||'+item.code)
    }
}
export function modify_left_list(data){
    //自己的确认
    for(var o in data){
        var item = data[o]
        if(this.tid == item.tid){
            if(item.option == 'insert'){
                this.insert_into_left({
                    cindex:item.cindex,
                    key:item.tid+'||'+item.code,
                    tid:item.tid,
                    tname:item.tname,
                    preclose:item.preclose,
                    code:item.code,
                    cname:item.cname,
                    post_allocated_amount:item.post_allocated_amount,
                    post_allocated_value:item.post_allocated_value,
                    post_exchange_amount:item.post_exchange_amount,
                    post_exchange_value:item.post_exchange_value,
                    stat:item.stat
                })
            }else{
                this.modify_left({
                    key:item.tid+'||'+item.code,
                    post_exchange_amount:item.post_exchange_amount,
                    post_exchange_value:item.post_exchange_value,
                    stat:item.stat
                })
            }
        }
    }
}


export function insert_into_left(data){
    this.askedExchange[data.key] = []
    this.modify_style_stat(data)
    this.myStocks.unshift(data)
}
export function modify_left(data){
    //style_stat 0:nohting,  1:expect_exchange,  2:trade,   3:has_asked
    var item = get_item_from_array_by_key(this.myStocks,['key'],data.key)
    for(var o in data){
        item[o] = data[o]
    }
    this.modify_style_stat(item)
}
export function delete_from_right_top(key){
    return delete_item_from_array_by_key(this.expectExchangeList,['key'],key)
}
export function delete_from_right_bottom(key){
    return delete_item_from_array_by_key(this.otherExpectExchangeList,['key'],key)
}
export function insert_into_right_top(data){
    this.expectExchangeList.unshift(data)
}
export function insert_into_right_bottom(data){
    this.otherExpectExchangeList.unshift(data)
}
export function insert_into_asked_list(data){
    this.askedExchange[data.asked_tid+'||'+data.asked_code].push(data)
}
export function delete_from_asked_list(data){
    var key = data.asked_tid+'||'+data.asked_code
    var info = delete_item_from_array_by_key(this.askedExchange[key],['id'],data.id)
    var item = get_item_from_array_by_key(this.myStocks,['key'],key)
    this.modify_style_stat(item)
    return info
}
export function init_style_stat(data){
    for(var i=0,len=data.length;i<len;i++){
        var item = data[i]
        this.modify_style_stat(item)
    }
}
//stat -> style
//0 1:expect 2:trade 3:again_expect
//0 2:wait   1:trade  2:wait            3:has_asked
export function modify_style_stat(item){
    if(this.askedExchange[item.key] && this.askedExchange[item.key].length > 0){
        item.style_stat = 3
    }else{
        if(item.stat == 3 || item.stat == 1){
            item.style_stat = 2
        }else if(item.stat == 2){
            item.style_stat = 1
        }else{
            item.style_stat = item.stat
        }
    }
}
export function ready() {
    var self = this

     jQuery(window).resize(function(){
         csp.fixTableHead("js-my-stocks-table", "100%", "100%")
         csp.fixTableHead("js-expect-stocks-table", "100%", "100%")
     });
     
    //希望换券
    socket.on('expectExchange',function(data){
        //同组
        if(data.tid == self.tid){
            self.modify_left(data)
            self.insert_into_right_top(data)
        }else{
            self.insert_into_right_bottom(data)
        }
        self.reload()
    })

    //取消希望换券
    socket.on('cancelExchange',function(data){
        //同组
        if(data.tid == self.tid){
            self.clear_asked(data.key)  //顺序对显示结果有影响
            self.modify_left(data)      //
            self.delete_from_right_top(data.key)
        }else{
            self.clear_ask(data.key)
            self.delete_from_right_bottom(data.key)
        }
        self.reload()

    })
    //请求换券
    socket.on('askExchange',function(data){
        //自己的请求
        if(data.ask_tid == self.tid){
            self.askExchangeList.push(data)
        //别人的请求
        }else if(data.asked_tid == self.tid){
            self.insert_into_asked_list(data)
            self.modify_left({
                key:data.asked_tid+'||'+data.asked_code,
            })
        }
        self.reload()
    })
    //确认换券
    socket.on('confirmAsk',function(data){
        self.clear_ask_list(data)
        self.clear_expect_list(data)
        self.clear_asked_list(data)
        self.modify_left_list(data)
        self.calculate_market_value()
        self.reload()
    })
    socket.on('refuseAsk',function(data){
        //同组
        if(data.ask_tid == self.tid){
            self.delete_from_ask_list(data)
        }else if(data.asked_tid = self.tid){
            self.delete_from_asked_list(data)
        }
    })

    socket.on('err',function(data){
        self.tipError(data)
    })


    $('.js_ask_exchange').submit(function(e){
        //e.preventDefault(); usually use this, but below works best here.
        return false;
    });

    $('.js_ask_exchange').form.settings.rules.ask_code = function(value){
        var item = get_item_from_array_by_key(self.myStocks,['code'],value)
        if(item){
            return true
        }else{
            return false
        }
    }
    $('.js_ask_exchange').form.settings.rules.code_stat = function(val){
        var item = get_item_from_array_by_key(self.myStocks,['code'],val)
        if(item.stat == 2){
            return false
        }else{
            return true
        }
    }
    $('.js_ask_exchange').form.settings.rules.ask_volume = function(val){
        if(self.source.post_exchange_amount >= +val){
            return true
        }else{
            return false
        } 
    }
    $('.js_ask_exchange').form.settings.rules.ask_value = function(val){
        if(self.post_value - self.askExchangeItem.ask_value  + (+self.askExchangeItem.asked_value) <= self.bp){
            return true
        }else{
            return false
        }
    }
    $('.js_ask_exchange').form.settings.rules.volume = function(val){
        if(val/100 > 0 && val%100 == 0){
            return true
        }else{
            return false
        }
    }
    $('.js_ask_exchange').form.settings.rules.asked_volume = function(val){
        if(self.target.post_exchange_amount >= +val){
            return true
        }else{
            return false
        }
    }

    $('.js_ask_exchange')
      .form({
        on : 'blur',
        fields: {
          ask_code: {
            identifier: 'ask_code',
            rules: [
              {
                type   : 'ask_code',
                prompt : '未拥有该股票'
              }/*,{
                type : 'code_stat',
                prompt : '该股票已交换过'
              }*/
            ]
          },
          ask_volume: {
            identifier: 'ask_volume',
            rules: [
              {
                type   : 'volume',
                prompt : '不是整手'
              },
              {
                type:'ask_volume',
                prompt:'数量不足'
              },
             {
                type   : 'ask_value',
                prompt : '超过bp'
              },
            ]
          },
          asked_volume: {
            identifier: 'asked_volume',
            rules: [
              {
                type   : 'volume',
                prompt : '不是整手'
              },{
                type : 'asked_volume',
                prompt : '数量不足'
              }
            ]
          },

        },
        onSuccess:function(event, fields){
            socket.emit('askExchange',self.askExchangeItem)
            jQuery('.js_exchange').modal('hide');
        }
      })



    getOid(function(err,data){
        if(data.success){
            self.getWishList(data.oid)
            //test({'maid':data.oid.split('.')[0]})
        }
     })





     self.$watch('askExchangeItem.ask_code',function(val){
        if(val && val.length == 6){
            var info = get_item_from_array_by_key(self.myStocks,['code'],val)
            self.source = info
            self.update_module_info('ask',info)
            self.askExchangeItem.ask_volume = info.post_exchange_amount
        }
     })

     self.$watch('askExchangeItem.ask_volume',function(val){
         if(val > 0){
            self.askExchangeItem.ask_value = Math.round(val * self.askExchangeItem.ask_price,2)
         }else{
            self.askExchangeItem.ask_value = 0
         }
         self.askExchangeItem.asked_value = self.target.post_exchange_value >  self.askExchangeItem.ask_value ? self.askExchangeItem.ask_value : self.target.post_exchange_value
     })

     self.$watch('askExchangeItem.asked_value',function(val){
         if(val > 0){
            self.askExchangeItem.asked_volume = Math.floor(val/self.askExchangeItem.asked_price/100)*100
         }else{
            self.askExchangeItem.asked_volume = 0
         }
     })

     self.$watch('askExchangeItem.asked_volume',function(val){
         if(val > 0){
            self.askExchangeItem.asked_value = Math.round(val*self.askExchangeItem.asked_price,2)
         }else{
            self.askExchangeItem.asked_value = 0
         }
     })


     $( "#js_right_column" ).droppable({
        accept: "#js_left_column tr",
        drop: function( event, ui ) {
            //如果已经在右表
            var key = currentItem.key
            var item = get_item_from_array_by_key(self.expectExchangeList,['key'],key)
            if(item){
                self.tipError('已申请换券')
            }else{
                self.expectExchange(currentItem)
            }
        }
    });

    jQuery(".js-update-view").addClass("active")
}


export function data() {
    return {
        stats:{
            '0':{
                'class':{
                    negative:false,
                    unexchange:true,
                    warning:false,
                    positive:false,
                },
                'name':'',
            },
            '1':{
                'class':{
                    negative:false,
                    unexchange:false,
                    warning:true,
                    positive:false,
                },
                'name':'交易完成',
            },
            '2':{
                'class':{
                    negative:true,
                    unexchange:false,
                    warning:false,
                    positive:false,
                },
                'name':'等待成交',
            },
            '3':{
                'class':{
                    negative:false,
                    unexchange:false,
                    warning:false,
                    positive:true,
                },
                'name':'条请求',
            },
        },

        tname:'',
        tid:'',
        myStocks: [],
        otherExpectExchangeList:[],
        expectExchangeList:[],
        askExchangeList:[],
        askedExchange:{},
        askedExchangeTemp:[],
        trader_info:{},
        team_info:{},

        //申请列表的索引
        index_list:{},

        askExchangeItem:{
            id:'',
            ask_tid : '',
            ask_tname : '',
            ask_code : '',
            ask_cname : '',
            ask_volume : '',
            ask_value : '',
            ask_price : '',

            asked_tid : '',
            asked_tname : '',
            asked_code : '',
            asked_cname : '',
            asked_volume : '',
            asked_value : '',
            asked_price : '',
            ask_time:'',
        },

        target:{},
        source:{
            cname:''
        },

        errInfo:'',

        bp:'',
        pre_value:'',
        post_value:'',

      }
}

export function tipError(data){
    var self = this
    self.errInfo = data
    jQuery('.js_err_info').modal('show')
}

export function calculate_market_value(){
    var self = this
    self.post_value = 0
    self.pre_value = 0
    for(var i=0,len=this.myStocks.length;i<len;i++){
        var item = this.myStocks[i]
        self.pre_value += (+item.post_allocated_value)
        self.post_value += (+item.post_exchange_value)
    }
}



export function getWishList(oid){
    var self = this
    getWishList(oid,function(err,data){

        self.askedExchange = data.askedExchange

        self.init_style_stat(data.myStocks)
        self.myStocks = data.myStocks

        self.otherExpectExchangeList = data.otherExpectExchangeList
        self.expectExchangeList = data.expectExchangeList
        self.askExchangeList = data.askExchangeList

        if(data.trader_info.tid && data.team_info[data.trader_info.tid]){
            self.bp = data.team_info[data.trader_info.tid].bp
        }else{
            self.bp = 0
        }

        self.calculate_market_value()

        self.trader_info = data.trader_info
        self.team_info = data.team_info

        self.tname = data.trader_info.tname
        self.tid = data.trader_info.tid

        self.reload()

    })
}

export function reload(){
    var self = this
    self.$nextTick(function() {
        jQuery(".js-update-view").removeClass("active")

        $("#js_left_column tr").popup('destroy')
        $("#js_left_column tr").draggable({
            disabled: true
        });

        $( "#js_left_column tr.unexchange,tr.warning").draggable({
            helper: "clone",
            cursor: "move",
            disabled:false,
            //scroll:false,
            appendTo:".temp_container",
            //appendTo:"body",
            cursorAt: { top: -2, left: -2 },
            start:function(event,ui){
                var item = get_item_from_array_by_key(self.myStocks,['code'],$(this).attr('code'))
                if(item.post_exchange_amount >= 100){
                    currentItem = item
                    ui.helper.css({
                        'box-shadow':'none',
                        'border':'1px solid rgba(34, 36, 38, 0.15)',
                        'z-index':'999',
                    })
                }else{
                    self.tipError('数量不足')
                    return false
                }
            }
        });

        $('.positive')
          .popup({
            popup : $('.js_asked_list'),
            on    : 'click',
            position : 'bottom center',
            onShow:function(event){
                self.askedExchangeTemp = self.askedExchange[$(event).attr('key')]
            }
          })

        csp.fixTableHead("js-my-stocks-table", "100%", "100%")
        csp.fixTableHead("js-expect-stocks-table", "100%", "100%")

    });
}

export function expectExchange(data){
    socket.emit('expectExchange',data)
}


export function cancelExchange(value){
    var self = this
    var item = get_item_from_array_by_key(self.myStocks,['tid','code'],value)
    socket.emit('cancelExchange',item)
}

export function askConfirm(key,value){
    var self = this
    var data = get_item_from_array_by_key(self.askedExchange[key],['id'],value)
    socket.emit('confirmAsk',data)
}
export function refuseAsk(key,value){
    var self = this
    var data = get_item_from_array_by_key(self.askedExchange[key],['id'],value)
    socket.emit('refuseAsk',data)
}

export function getExchangeStock(){
    var self = this
    for(var i=0,len=self.expectExchangeList.length;i<len;i++){
        var item = self.expectExchangeList[i]
        return item
    }
    for(var i=0,len=self.myStocks.length;i<len;i++){
        var item = self.myStocks[i]
        if(item.post_exchange_amount >= 100){
            return  item
        }
    }
    return {}
}

export function cancel_ask(){
    //jQuery('.js_ask_exchange').form('clear')
}


function delete_item_from_array_by_key(array,keys,value,all){
    var result = []
    for(var i=0,len=array.length;i<len;i++){
        var item = array[i]
        var item_array = []
        for(var j=0,j_len=keys.length;j<j_len;j++){
            var temp_item = keys[j]
            if(item[temp_item] != undefined){
                item_array.push(item[temp_item])
            }
        }
        if(item_array.join('||') == value){
            var temp_result = array.splice(i,1)
            --i
            --len
            if(all){
                result.push(temp_result)
            }else{
                return temp_result
            }
        }
    }
    if(all){
        return result
    }else{
        return false
    }
}

function get_item_from_array_by_key(array,keys,value){
    for(var i=0,len=array.length;i<len;i++){
        var item = array[i]
        var item_array = []
        for(var j=0,j_len=keys.length;j<j_len;j++){
            var temp_item = keys[j]
            if(item[temp_item] != undefined){
                item_array.push(item[temp_item])
            }
        }
        if(item_array.join('||') == value){
            return item
        }
    }
    return false
}

function digit2(number){
    if(number > 0){
        return Math.floor(number*100+0.5)/100
    }else{
        return Math.ceil(number*100-0.5)/100
    }
}

function digit4(number){
    if(number > 0){
        return Math.floor(number*10000+0.5)/10000
    }else{
        return Math.ceil(number*10000-0.5)/10000
    }
}
</script>




<script server>
export function getOid(postman){
    postman({success:true,oid:postman.req.session.oid})
}
export function test(postman,option){

    ison.db.business.clearExchangeInfo(option,function(err,data){

        console.log(err,data)
    })
}

export function getWishList(postman,traderid){

    var result = {
        myStocks:[],
        otherExpectExchangeList:[],
        expectExchangeList:[],
        askExchangeList:[],
        trader_info:{},
        team_info:{},
        askedExchange:{},
    }
    
    var maid = traderid.split('.')[0]
    var has_data_flag = false
    var new_data = []
    var tid = ''
    Step.Step(function(data){
        //小组信息
        var that = this
        if(!traderid){
            that.end('账号不存在')
            return
        }
        var sql_t_info = "SELECT SUM(t.bp) AS bp,i.* FROM `csp_team_member` AS m LEFT JOIN `tstrader` AS t ON m.traderid = t.traderid AND m.trid = t.trid LEFT JOIN `csp_team_info` AS i ON m.tid = i.tid  GROUP BY m.tid"
        ison.db.query(sql_t_info, function(err, data) {
            for(var i=0,len=data.length;i<len;i++){
                var item = data[i]
                if(item.tid){
                    result.team_info[item.tid] =  item
                }
            }
            that.step()
        })  
    },function(data){
        //交易员信息
        var that = this
        var sql_trader_info = "SELECT * FROM `csp_team_member` WHERE  traderid = '"+traderid+"'"
        ison.db.query(sql_trader_info, function(err, data) {
            if(data[0] && data[0].tid){
                var item = data[0]
                item.tname = get_tname(item.tid)
                result.trader_info = item
                
                tid = item.tid
                
                that.step() 
            }else{
                that.end()
            }
        })
    },function(){
        //判断是否有换券信息
        var that = this
        var sql = "SELECT * FROM `csp_exchange_list` AS c LEFT JOIN `csp_team_member` AS m ON c.tid = m.tid WHERE m.traderid LIKE '"+maid+".%' LIMIT 0,1"
        ison.db.query(sql, function(err, data) {
            if(err){
                console.log(err,sql)
                that.end()
            }else{
                if(data.length>0){
                    has_data_flag = true
                }
                that.step()
            }
        })
    },function(){
        //没有换券信息 从csp_random_allocated_results表获取信息
        var that = this
        if(has_data_flag){
            that.step()
        }else{
            var sql = "SELECT tid,cindex,`code`,cname,post_allocated_amount FROM `csp_random_allocated_results` WHERE tid IN (SELECT tid  FROM `csp_team_member` WHERE traderid LIKE '"+maid+".%')"
            ison.db.query(sql, function(err, data) {
                if(err){
                    console.log(err,sql)
                    that.end()
                }else{
                    new_data = data
                    that.step()
                }
            })
        }
    },function(){
        //插入最新值
        var that = this
        if(has_data_flag || !new_data.length){
            that.step()
        }else{
            var sql = "INSERT INTO `csp_exchange_list` (`tid`, `cindex`, `code`, `cname`, `post_allocated_amount` , `post_exchange_amount`) VALUES "
            var values = []
            for(var i=0,len=new_data.length;i<len;i++){
                var item = new_data[i]
                var temp = "('"+item.tid+"','"+item.cindex+"','"+item.code+"','"+item.cname+"','"+item.post_allocated_amount+"','"+item.post_allocated_amount+"')"
                values.push(temp)
            }
            sql += values.join(',')
            ison.db.query(sql, function(err, data) {
                if(err){
                    console.log(err,sql)
                    that.end()
                }else{
                    that.step()
                }
            })
        }
    },function(){
        //自己的票
        var that = this
        var sql = "SELECT l.*,ROUND(l.post_allocated_amount * c.preclose,2) AS post_allocated_value,ROUND(l.post_exchange_amount*c.preclose,2) AS post_exchange_value,preclose  FROM `csp_exchange_list` AS l LEFT JOIN tscode AS c ON l.code = c.code WHERE (c.tid = '3002' OR c.tid = '1001') and l.tid='"+tid+"' ORDER BY l.cindex DESC"
        ison.db.query(sql, function(err, data) {
            if(err){
                console.log(sql,err)
                that.end()
            }else{
                for(var i=0,len=data.length;i<len;i++){
                    var item = data[i]
                    item.tname = get_tname(item.tid)
                    item.key = item.tid+'||'+item.code
                    result.myStocks.push(item)
                    result.askedExchange[item.key] = []
                }
                that.step()
            }
        }) 
    },function(){
        //申请的票
        var that = this
        var sql = "SELECT l.*,ROUND(l.post_allocated_amount * c.preclose,2) AS post_allocated_value,ROUND(l.post_exchange_amount*c.preclose,2) AS post_exchange_value,preclose  FROM `csp_exchange_list` AS l LEFT JOIN tscode AS c ON l.code = c.code WHERE (c.tid = '3002' OR c.tid = '1001') and l.tid IN (SELECT tid  FROM `csp_team_member` WHERE traderid LIKE '"+maid+".%')  and (l.stat = 1 or l.stat = 3) ORDER BY l.expect_exchange_time"
        ison.db.query(sql, function(err, data) {
            if(err){
                console.log(sql,err)
                that.end()
            }else{
                for(var i=0,len=data.length;i<len;i++){
                    var item = data[i]
                    item.tname = get_tname(item.tid)
                    item.key = item.tid+'||'+item.code
                    if(item.tid == tid){
                        result.expectExchangeList.push(item)
                    }else{
                        result.otherExpectExchangeList.push(item)
                    }
                }
                that.step()
            }
        }) 
    },function(){
        //请求交换 或 被请求交换信息
        var that = this
        var sql_ask_exchange_list = "SELECT * FROM `csp_asked_change_list` WHERE (ask_tid = "+tid+" OR asked_tid = "+tid+") AND stat = 1 ORDER BY update_time DESC"
        ison.db.query(sql_ask_exchange_list, function(err, data) {
            for(var i=0,len=data.length;i<len;i++){
                var item = data[i]
                item.ask_tname = get_tname(item.ask_tid)
                item.asked_tname = get_tname(item.asked_tid)
                if(item.ask_tid == tid){
                    item.key = item.ask_tid+'||'+item.ask_code
                    result.askExchangeList.push(item)
                }
                if(item.asked_tid == tid){
                    item.key = item.asked_tid+'||'+item.asked_code
                    result.askedExchange[item.key].push(item)
                }
            }
            that.step()
        })
    },function(data){
        postman(result)
    })

    function get_tname(tid){
        if(tid && result.team_info[tid]){
            return result.team_info[tid].tname
        }else{
            return ''
        }
    }
}
</script>
<style>
.handle.lk.bottom.box{
        overflow: hidden;
    line-height: 26px;
    padding: 4px 0;
}
.handle.lk.bottom.box > *{
    margin-right: 0;
}
.handle.lk.bottom.box .ui.button{
    float: right;
    padding: 7px 1px;
}
.data-container.lk{
    height: 97%;
}
p.info{
    margin-bottom: 0;
    color: #0d0d0d;
}
.info span{
    margin-right: 22px;
}
.left .table-container.lk{
    height: 70%;
    min-height: 217.4px;
}
.right .table-container.lk{
    height: 73.5%;
    /*min-height: 543px;*/
}
.Exchange{
    width: 100%;
    height: 100%;
    padding-top: 12px;
}
.red.font{
    color: #dd2b28;
}
.blue.font a{
    color: #0066ff;
}
th.three.wide.center.aligned{
    max-width: 140px !important;
}

.js_err_info .content{
    text-align:center;
    color:red;
}

.handle.box > * {
    margin-right: 20px;

}
.ui.modal.js_exchange{
    width: 536px;
}
.ui.modal.js_exchange .actions{
    width: 536px;
    position: relative;
    right: 18px;
    height: 56px;
}
.ui.modal > .content.js_ask_exchange{
    min-height: 304px;
    padding-bottom: 0;

}
.ui.form.js_ask_exchange > p{
    margin: 0 0;
}
.ui.form .inline.fields .field.lk{
    margin-right: 1em;
}
</style>
