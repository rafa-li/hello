<!--
/**
* @file 小组换券
* @author ll
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
*/
-->
<template class="Random">
    <div class="ui medium header Rd">随机分券</div>
        <div class="ui grid Rd">
            <div class="four wide column Rd">
                 <widget-unit-selector v-ref:unit_selector></widget-unit-selector>
            </div>
            <div class="twelve wide column Rd">
                <div class="second-title">随机分券结果------
                    <a class="display-unit js-unit-name">{单元:</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a class="display-tid js-tid-name">小组:</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a class="display-tid js-tid-bp">小组bp:</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a class="display-tid js-tid-allocated-value">分券市值:}</a>
                    <button class="ui primary button js-random-output" v-on:click="randomOutput" disabled=true> 导&nbsp;&nbsp;出 </button>
                </div>
                <!-- <div class="detail-info"> -->

                <!-- </div> -->
                    <div class="data-container">
                        <div class="data">
                            <div class="ui inverted dimmer js-wait-random-div">
                                <div class="ui text loader" >正在分券，请稍等...</div>
                            </div>
                            <div class="ui small modal js-random-allocated-comfirm">
                                <i class="close icon"></i>
                                <div class="header"> 提示 </div>
                                <div class="modal-allocated">
                                    <i class=" big info circle icon this_html_only"></i>
                                    <span class="point-out-message">
                                      分券之后将改变上一次的分券结果，并清空换券结果！请确认是否现在分券？
                                  </span>
                                </div>
                                <div class="actions">
                                  <div class="ui negative button" v-on:click="updateModalState('js-random-allocated-comfirm', 'hide')">否 </div>
                                  <div class="ui positive right labeled icon button" v-on:click="randomAllocatedConfirm">是  </div>
                                </div>
                            </div>


                            <div class="table-container js-random-results ">
                                <table class="ui single line selectable striped table" id="js-random-results-table">
                                    <thead id="fix-header js-random-results-header">
                                        <tr>
                                                <th>序号</th>
                                                <th>证券代码</th>
                                                <th>证券名称</th>
                                                <th>心愿数量</th>
                                                <th>实际数量</th>
                                        </tr>
                                    </thead>
                                    <tbody class="js-random-results-body" id="results">
                                            <tr v-for="data in randmR">
                                                <td>{{$index+1}}</td>
                                                <td>{{data.code}}</td>
                                                <td>{{data.cname}}</td>
                                                <td>{{data.amount}}</td>
                                                <td>{{data.post_allocated_amount}}</td>
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="showBeforeRandom">
                                <p class="before-random" >
                                    你还未进行分券，分券后才能查看结果！
                                </p>

                            </div>
                        </div>
                    </div>
            </div>
    </div>
</template>



 <style type="text/css">
     .Random{
         height: 100% ;
         width: 100% ;
         padding-top:12px;
          }
     .ui.medium.header.Rd{
         font-size: 1.5em;
     }
     .ui.header.Rd:first-child {
         margin-top: 1em;
     }
     .js-unit-name,.js-tid-name,.js-tid-bp,.js-tid-allocated-value{
         color: #f2711c;
     }
     .column.Rd{
        height: 100%;
     }
     .ui.grid.Rd{
        height: 90%;
     }
     .ui.styled.accordion.Rd .title{
         padding: 0em 0em;
     }
     .ui.floating.dropdown.button{
         margin-left: 0;
         margin-right: 16px;
     }
     .js-random-results{
         margin-top: 1.5em;
     }
    /*.js-random-results-header{
         position:absolute;
     }
     .js-random-results-body{
          height:92%;
     }*/
     .ui.button.js-random-div-on-btn{
         border:0px;
         background-color: #7999D8;
         height: 15px;
         width: auto;
         text-align:center;
         padding-top:0px;
         padding-bottom:0px;

     }
     .ui.button.js-random-output{
         float: right;
     }
     .before-random{
        font-size:20px;
        text-align: center;
        border: null;
    }
    .choose-aready{
        color:
    }
    .modal-allocated{
        margin: 20px 24px 0 20px;
        height: 100px;
    }
    .circle.icon.this_html_only{
        float:left;
        width: 42px;
        height: 42px;
        margin: 28px 1px 1px 1px;
    }
    .point-out-message{
        line-height: 5.8;
        font-size: 14px;
        text-align: left;

    }

    .tname-click{
        color: #f2711c;
    }
 </style>




<script server>

/**
 * @desc 全局信息
 *itemPreDiv   总券中每一只股票的信息
 *unitWishPre  每一个资产单元的小组的心愿
 *market_value 分券前日总券表中券的市值
 *bp_data      小组bp
 * @author ll
 */
var itemPreDiv=[];
var unitWishPre=[];
var market_value=[];
var bp_data=[];
var allStockFlag=1;
var teamAllocateFlag=1;

/*
*由登录获取资产管理人id
*/

export function getMaid(postman){
    postman({maid:postman.req.session.maid});
}
/**
* @brief 判断是否有未分配完的股票
* @author Liulin
* @param[in] ItemPreDiv 待分配的总券
* @return allStockFlag标志。1为分配完成，否则为0；
*/

  function checkUnitStock(ItemPreDiv){

      for(var i=0;i<ItemPreDiv.length;i++){
          if(ItemPreDiv[i].amount){
              allStockFlag=0;
          }
      }
        return allStockFlag;

  }
  /**
  * @brief 判断是否有未满足的心愿
  * @author Liulin
  * @param[in] UnitWish 小组心愿清单
  * @return teamAllocateFlag标志。1为分配完成，否则为0；
  */

  function checkGroupWish(UnitWish){

    for(var i=0;i<UnitWish.length;i++){
        for(var j=0;j<UnitWish[i].children.length;j++){
            if(UnitWish[i].children[j].flag!==1){
                teamAllocateFlag=0;
            }
        }
    }
    return teamAllocateFlag;
 }

 /**
 * @brief 克隆一个对象
 * @author LuChenQun
 * @date 2015/12/16
 * @param[in] obj 传入的对象
 * @par 代码来自：http://kingwell-leng.iteye.com/blog/1675694
 * @return 克隆后的对象
 */
 function clone(obj){
     var o;
     if (typeof obj == "object") {
         if (obj === null) {
             o = null;
         } else {
             if (obj instanceof Array) {
                 o = [];
                 for (var i = 0, len = obj.length; i < len; i++) {
                     o.push(clone(obj[i]));
                 }
             } else {
                 o = {};
                 for (var j in obj) {
                     o[j] = clone(obj[j]);
                 }
             }
         }
     } else {
         o = obj;
     }
     return o;
 }
 //结果展示

 /**
  * @desc 随机分券
  * @author ll
  * @param {Object} postman  - 推送的数据对象
  * @param {string} trid  - 分券的单元id  maid  - 资产管理人帐号
  */
 export function unitRandmDiv(postman,trid,maid){

     Step.Step(function(data){
         var that=this;
         var sql_market_value="SELECT cname,code,preclose FROM tscode where  code in (select code from csp_trid_securities where trid="+"'"+trid+"'"+") "
          ison.db.query(sql_market_value,function(err,value_data){
              market_value=value_data;
            //   console.log("dddddddddd",market_value);
              that.step();
          })
     },function(data){
         //取出总券表，itemPreDiv取出来的总表信息
             var that=this;
             var sql="select a.code,a.cname,a.amount from csp_trid_securities a where maid="+"'"+maid+"'"+"and trid="+"'"+trid+"'"
             ison.db.query(sql,function(err,data){
                 var length=data.length;
                 var indexStock=-1;//总券中股票的标号
                 for(var i=0;i<length;i++){
                     indexStock++;
                     var itemStock= {code:'', cname: '', amount:'', market_value:''}
                     itemStock.code = data[i].code;
                     itemStock.cname = data[i].cname;
                     itemStock.amount = data[i].amount;
                     for(var k=0;k<market_value.length;k++){
                         if(data[i].code==market_value[k].code)
                         {
                             itemStock.market_value=market_value[k].preclose;
                             break;
                         }
                     }
                     itemPreDiv[indexStock] = itemStock;

                 }
                   that.step(itemPreDiv);
             })

     },function(data){
         var that=this;
         var sql_bp="SELECT SUM(t.bp) AS bp,i.* FROM `csp_team_member` AS m LEFT JOIN `tstrader` AS t ON m.traderid = t.traderid AND m.trid = t.trid LEFT JOIN `csp_team_info` AS i ON m.tid = i.tid  GROUP BY m.tid"
             ison.db.query(sql_bp,function(err,data){
                 bp_data=data;

                 that.step(bp_data)
             })

     },function(bp_data){
                 var that=this;

                 var sql_wish = "select a.tid,a.cindex,a.code,a.cname,a.amount from csp_group_wish_list as a inner join "+"("+"select tid from csp_team_info where trid='"+trid+"')"+ "as b on a.tid=b.tid"
                 ison.db.query(sql_wish, function(err, data) {
                 var length = data.length
                 var tidPre = ''
                 var indexTid = -1
                 var indexCindex = -1
                 for(var i=0; i<length; i++){
                     if(tidPre !== data[i].tid){
                         indexTid++
                         tidPre = data[i].tid

                         var itemtid = {tid:'',tid_bp:'',allocated_sum_value:'', children:[]}
                         itemtid.tid=data[i].tid
                         itemtid.allocated_sum_value=0;
                         for(var j=0;j<bp_data.length;j++){
                             if(data[i].tid==bp_data[j].tid)
                             {
                                 itemtid.tid_bp=bp_data[j].bp;
                                 break;
                             }
                         }
                         unitWishPre[indexTid] = itemtid
                         indexCindex = -1
                     }

                     indexCindex++
                     var itemGroup={cindex:'',code:'',cname:'',amount:'',flag:'',allocated_value:'',allocated_amount:''}
                     itemGroup.cindex=data[i].cindex;
                     itemGroup.code=data[i].code;
                     itemGroup.cname=data[i].cname;
                     itemGroup.amount=data[i].amount;

                     itemGroup.flag=0;//获取时全部未分配
                     itemGroup.allocated_value=0;
                     itemGroup.allocated_amount=0;
                     unitWishPre[indexTid].children[indexCindex] = itemGroup;

                 }
                  that.step(unitWishPre);
     })
 },function(data){
     var that=this;
     var sql="delete from csp_random_allocated_results where tid in(select tid from csp_team_member where trid ='"+trid+"')"

     ison.db.query(sql,function(err,data){
        that.step();
     });

 },function(data){
     var that=this;
     var ItemPreDiv=itemPreDiv;//取出数据便于对其操作
     var UnitWish= clone(unitWishPre);
    //  console.log("itemPreDiv-----------",itemPreDiv)
    //  console.log("1---->",unitWishPre);
    while (!checkUnitStock(ItemPreDiv)) {
         //总券未分配完
         allStockFlag = 1;
         while (!checkGroupWish(UnitWish)) {
            //小组愿望清单未被分配完
            teamAllocateFlag = 1;
            var i = 0;
            //随机分券
            var index = Math.floor(Math.random() * UnitWish.length);
            var cindexLength = UnitWish[index].children.length;
            while (i < cindexLength && UnitWish[index].children[i].flag === 1) {
                 i++;
                }
            if (i === cindexLength) {
             //该小组分配完
              console.log("该小组分配完",cindexLength);
             }
            if (i <cindexLength) {

             //index 小组i+1优先级未分配
             //从总券中查询 ItemPreDiv
             for (var k = 0; k < ItemPreDiv.length; k++) {

                if (ItemPreDiv[k].code === UnitWish[index].children[i].code) {
                    UnitWish[index].children[i].flag = 1; //标记分配完成
                    if (ItemPreDiv[k].amount > UnitWish[index].children[i].amount ){
                         UnitWish[index].children[i].allocated_amount = UnitWish[index].children[i].amount;
                         ItemPreDiv[k].amount = parseInt(ItemPreDiv[k].amount) - parseInt(UnitWish[index].children[i].amount);
                         UnitWish[index].children[i].allocated_value = Number(UnitWish[index].children[i].amount) *Number(ItemPreDiv[k].market_value);
                         UnitWish[index].allocated_sum_value=Number(UnitWish[index].allocated_sum_value)+Number(UnitWish[index].children[i].allocated_value);

                        } else if (ItemPreDiv[k].amount <= UnitWish[index].children[i].amount) {

                                 UnitWish[index].children[i].allocated_amount = ItemPreDiv[k].amount;
                                 ItemPreDiv[k].amount = 0;
                                 UnitWish[index].children[i].allocated_value = Number(UnitWish[index].children[i].allocated_amount) *Number(ItemPreDiv[k].market_value);
                                 ItemPreDiv[k].market_value = 0;
                                 UnitWish[index].allocated_sum_value=Number(UnitWish[index].allocated_sum_value)+Number(UnitWish[index].children[i].allocated_value);
                                 }
                                 break;
                }

             }
          }

        } //小组愿望清单分配完
        //小组愿望清单分配完，总券表有剩余，进行均分操作
        var leaveOrNot=averageAllocated(ItemPreDiv,UnitWish);
        if(leaveOrNot){
            postman({leave:true})
            return;
        }

    } //总表分配完
    var mysql;
    for(var i=0;i<UnitWish.length;i++){
       for(var j=0;j<UnitWish[i].children.length;j++){
           mysql="insert into csp_random_allocated_results (tid,cindex,code,cname,amount,post_allocated_amount,post_allocated_value,trid)VALUES"
           +"('"+UnitWish[i].tid+"','"+UnitWish[i].children[j].cindex+"','"+UnitWish[i].children[j].code+"','"
           +UnitWish[i].children[j].cname+"','"+UnitWish[i].children[j].amount+"','"
           +UnitWish[i].children[j].allocated_amount+"','"
           +UnitWish[i].children[j].allocated_value+"','"
           +trid+"')"
           +"ON DUPLICATE KEY UPDATE post_allocated_amount='"+UnitWish[i].children[j].allocated_amount+"',"
           +"post_allocated_value='"+UnitWish[i].children[j].allocated_value+"'"
           ison.db.query(mysql,function(err,data){
             that.step();
           });
       }
   }

  },function(data){

        postman({successOr:true})
   })
}
/**
* @brief 均分剩余券表时，将无法容纳分配券的小组剔除
* @author liulin
* @param[in] a=ItemPreDiv[m] - 总券中的某一只剩余券  b=UnitWish 小组心愿清单
* @return temp。可被分配的小组
*/

export function checkUnitBp(a,b){
    var temp=clone(b);
    var value=100*a.market_value;

    for(var i=0;i<temp.length;i++){
        var left_value=Number(temp[i].tid_bp)-Number(temp[i].allocated_sum_value)
        if(left_value<value){
            //该组直接out
            temp.splice(i,1)
        }
    }
    return temp;
}
/**
* @brief 将券表a分给temp小组
* @author liulin
* @param[in] a=ItemPreDiv[m] - 总券中的某一只剩余券  temp - 可分配的小组信息  UnitWish 小组心愿清单
* @return temp。可被分配的小组
*/

export function allocateGroup(a,temp,UnitWish){
     for(var m=0;m<temp.length;m++){
         for(var n = 0; n < UnitWish.length; n++){
             if(UnitWish[n].tid===temp[m].tid){
                var fffflag=0;
                for(var j = 0; j < UnitWish[n].children.length; j++) {
                    if (UnitWish[n].children[j].code === a.code) {
                         UnitWish[n].children[j].allocated_amount = Number(UnitWish[n].children[j].allocated_amount) + 100;
                         UnitWish[n].children[j].allocated_value=Number(UnitWish[n].children[j].allocated_amount ) * Number(a.market_value);
                         UnitWish[n].allocated_sum_value=Number(UnitWish[n].allocated_sum_value)+100*Number(a.market_value)
                         console.log(UnitWish[n].allocated_sum_value +"分配总量");
                         console.log(UnitWish[n].children[j].allocated_amount +"被平分且原来有时的数量");
                         fffflag=1;
                        break;
                    }
                }
                if(fffflag===0){
                   var cindex_insert=UnitWish[n].children.length;
                   var itemGroup = { cindex: '', code: '', cname: '', amount: '', flag: '', allocated_value: '', allocated_amount: '' };
                       itemGroup.cindex = cindex_insert+1;
                       itemGroup.code = a.code;
                       itemGroup.cname = a.cname;
                       itemGroup.amount = 0;

                       itemGroup.flag = 1; //分配
                       itemGroup.allocated_value =100 * Number(a.market_value);
                       itemGroup.allocated_amount = 100;
                       UnitWish[n].allocated_sum_value+=100*Number(a.market_value)
                       UnitWish[n].children.push(itemGroup);
                    //    console.log(UnitWish[n].allocated_sum_value +"分配总量2");

                 }
             }
         }
     }
     for(var p=0;p<UnitWish.length;p++){
         console.log("sssssssssss",UnitWish[p].allocated_sum_value);
     }
}
/**
* @brief 从n个小组中随机选出不重复的times个小组
* @author liulin
* @param[in] times- 选取个数 UnitWish 小组心愿清单
* @return randomTemp。选取结果
*/

export function randomTeams(times,UnitWish) {
    var temp=clone(UnitWish);
    var randomTemp=[];

    for(var i=0;i<times;i++) {
        if(temp.length>0) {
            var arrIndex = Math.floor(Math.random()*temp.length);
            randomTemp[i] = temp[arrIndex];
            temp.splice(arrIndex, 1);

        }
        else {
            break;
        }
    }
    console.log("rrrrrrrrrrrr======",JSON.stringify(randomTemp))
    return randomTemp;
}

/**
* @brief 满足愿望清单之后，剩余券的分配
* @author liulin
* @param[in] ItemPreDiv - 总券 UnitWish - 小组心愿清单
*/

//满足愿望清单之后，剩余券的分配
export function averageAllocated(ItemPreDiv,UnitWish) {
    var leave=0;
    for (var i=0;i<ItemPreDiv.length;i++) {
        while(ItemPreDiv[i].amount>=100) {
            var times=ItemPreDiv[i].amount/100;
            var temp=checkUnitBp(ItemPreDiv[i],UnitWish);
            console.log("========qqqqqqqqqq",temp.length)
            if(!temp.length) {
                leave++;
                console.log("========ssssssssssss",leave)
                return leave;
            }
            else {
                if(times>=temp.length) {
                    //给选出来的小组都分配
                     allocateGroup(ItemPreDiv[i],temp,UnitWish);
                     ItemPreDiv[i].amount=Number(ItemPreDiv[i].amount)-100*temp.length;

                }
                else {
                    //随机选出times个组并对其进行分配
                    var randomTemp=randomTeams(times,UnitWish);
                    allocateGroup(ItemPreDiv[i],randomTemp,UnitWish);
                    ItemPreDiv[i].amount=Number(ItemPreDiv[i].amount)-100*times;
                }
                return 0;

            }//总券有剩余，给予提示，进行更改

        }
    }
}
/**
* @brief 分配结果清单中查找默认显示数据
* @author liulin
*/
export function getMinTid(postman) {
    var sql="select min(tid) as tid from csp_random_allocated_results"

    ison.db.query(sql,function(err,data) {
        if(!data[0].tid) {

            postman({undiv:true});
        }
        else {
            postman(data);
        }
    })
}

export function getNamebyTid(postman,tid) {
    var ret={
        "trname":'',
        "tname":'',
        "t_bp":'',
        "t_allocated_bp":'',
        "trid":''
    }

    Step.Step(function(data){
        var that=this;
        var sql_tname="SELECT tname, trid FROM csp_team_info where tid="+"'"+tid+"'"
        ison.db.query(sql_tname,function(err,data){
            if(err){
                ret.tname=null;
                ret.trid=null;
                that.step();
            }
            else {
                ret.tname=data[0].tname;
                ret.trid=data[0].trid;
                that.step();
            }
        })
    },function(data){
        var that=this;
        var sql_trname="SELECT trname FROM tatrd where trid="+"'"+ret.trid+"'"
        ison.db.query(sql_trname,function(err,data){
            if(err){
                ret.trname=null;
                that.step();
            }
            else{
                ret.trname=data[0].trname;
                that.step();
            }

        })
    },function(data){
        var that=this;
        var sql_tbp="SELECT SUM(t.bp) AS bp,i.* FROM `csp_team_member` AS m LEFT JOIN `tstrader` AS t ON m.traderid = t.traderid AND m.trid = t.trid LEFT JOIN `csp_team_info` AS i ON m.tid = i.tid  where m.tid="+"'"+tid+"'"
        ison.db.query(sql_tbp,function(err,data){
            if(err){
                ret.t_bp=null;
                that.step();
            }
            else{
                ret.t_bp=data[0].bp;
                that.step();
            }

        })
    },function(data){
        var that=this;
        var sql_t_allocated_bp="SELECT SUM(post_allocated_value ) as allvalue FROM csp_random_allocated_results WHERE  tid="+"'"+tid+"'"
        ison.db.query(sql_t_allocated_bp,function(err,data){
            if(err){
                ret.t_allocated_bp=0;
                that.step();
            }
            else{
                ret.t_allocated_bp=data[0].allvalue;
                that.step();
            }

        })
    },function(data){
        postman(ret);

    })

}

/**
 * @desc显示小组分券结果
 * @author ll
 * @param {Object} postman  - 推送的数据对象
 * @param {string}tid  - 小组id
 */
export function getRandmR(postman,tid) {
    var sql = "select *from csp_random_allocated_results where tid="+tid+" "+"order by CAST(cindex as SIGNED) asc";
    ison.db.query(sql,function(err,data){
        postman(err||data);
    });
}

export function delExchangeData(postman,maid) {
    var option = {
        maid:maid
    }
    ison.db.business.clearExchangeInfo(option,function(err,data){
        console.log(err,data)
    })
}


/**
* @desc 导出数据
* @author
* @param {Object} postman   - 推送的数据对象
* @param {string} tid - 输入的数据(即查询条件)
*/
export function saveTidExcelFile(postman,tid) {
    var selSQL = "select *from csp_random_allocated_results where tid="+tid+" order by cindex";
     var filename = "The_"+tid+"_group_randomOut"
    ison.db.query(selSQL, function(err,data) {
        if(!err){
    //写入表格
             var tidRandomData = data;
                var cols = []
                var rows = []
                var titles = [
                    "序号","证券代码","证券名称","心愿数量","实际数量"
                ]
                  //规定列数和类别
                    for(var i=0; i<titles.length; i++){
                        var item = {}
                        item.caption = titles[i];
                        item.type = 'string'
                        cols.push(item)
                    }
                    for(var i=0; i<tidRandomData.length; i++){
                        var item = []
                        item.push(tidRandomData[i].cindex)
                        item.push(tidRandomData[i].code)
                        item.push(tidRandomData[i].cname)
                        item.push(tidRandomData[i].amount)
                        item.push(tidRandomData[i].post_allocated_amount)
                        rows.push(item)
                    }
                    excel.export(postman, cols, rows,filename)

            }


    });
}
</script>

<!-- 前端代码，在浏览器中执行  -->
<script>
var vueSelf = {}//vue的this指针
var display_tid_now;//
var cur_div_on_btn_id;
var maid ='';
/**
 * @func
 * @desc vue绑定数据
 * @author
 */
export function data() {
    return {
        "randmR":[],
        "successOr":false,
    }
}


/**
 * @func
 * @desc 初始化
 * @author ll
 */
export function ready() {
    // var self = this
    vueSelf = this
    getMaid(function(err,data) {
        if(!err){
            maid = data.maid;
            console.log(maid)
            vueSelf.$refs.unit_selector.updateSelectorList(maid);

        }
    })


    jQuery("#showBeforeRandom").hide();
    lastAllocatedGroupDis();

    setTimeout(function() {
        jQuery(".js-tid-item").on("click",function() {
            var tid_id_on=$(this).attr("tid");
            groupDisplay(tid_id_on);
            display_tid_now=tid_id_on;

        })
    },2000)

    setTimeout(function() {
        jQuery(".js-trid-name").append("<button class=\"ui button js-random-div-on-btn\"  >一键分券</button>");
        jQuery(".ui.js-random-div-on-btn").each(function(i) {
            this.id =  "button"+i;
        })

        jQuery(".js-random-div-on-btn").hide();
        jQuery(".js-trid-name").hover(function() {
            var unitid=$(this).attr("flag")
            var buttonid="button"+unitid;
            $("#"+buttonid).show()
        },
        function() {
            var unitid=$(this).attr("flag")
            var buttonid="button"+unitid;
            $("#"+buttonid).hide()
            // console.log(buttonid);
        })
    },2000)

    jQuery(this.$el).on("click", ".js-random-div-on-btn",function() {
        jQuery('.js-random-allocated-comfirm').modal('show');
        cur_div_on_btn_id=$(this).attr("id");

    })
}


export function randomAllocatedConfirm() {
    var self = this
    var trid_id;
    var tid_id_first;
    var trid_flag;
    updateModalState('js-random-allocated-comfirm', 'hide')
    trid_flag=cur_div_on_btn_id.replace(/[^0-9]/ig,"");
    trid_id=$("[flag="+"'"+trid_flag+"'"+"]").attr("id")
    tid_id_first=$("[flag="+"'"+trid_flag+"'"+"]").next().children().eq(0).attr("tid")

    groupOutput(trid_id,tid_id_first);
    display_tid_now=tid_id_first;


    $("#"+cur_div_on_btn_id).attr('disabled',true)
    setTimeout(function(){
        $("#"+cur_div_on_btn_id).attr('disabled',false)

    },10000)

    $(".before-random ").hide();
    $(".js-wait-random-div").addClass("active")
    setTimeout(function(){
    $(".js-wait-random-div").removeClass("active")
    },3000)

}


export function lastAllocatedGroupDis() {
    getMinTid(function(err,data) {
        if(typeof data.undiv!=='undefined'&&(data.undiv===true)) {
            jQuery("#showBeforeRandom").show();
        }
        else {
            csp.fixTableHead("js-random-results-table", "100%", "100%");
            var lastTid=data[0].tid;
            display_tid_now=lastTid;
            jQuery(".js-random-output").attr("disabled",false)
            var x=$("[displayflag="+"'"+lastTid+"'"+"]")
            x.addClass("tname-click");
            x.parent().siblings().children().removeClass("tname-click");
            x.parent().parent().parent().siblings().children().children().children().removeClass("tname-click");
            getRandmR(lastTid,function(err,data) {
                    vueSelf.randmR = data;
                    getNamebyTid(lastTid,function(err,data){
                        // console.log("ddddddddd",JSON.stringify(data))
                         $(".js-unit-name").html("{单元名:" + data.trname);
                         $(".js-tid-name").html("小组名:" + data.tname);
                         $(".js-tid-bp").html("小组bp:" + data.t_bp);
                         $(".js-tid-allocated-value").html("分券市值:" + data.t_allocated_bp+"}");
                    })
            })
        }
    })

}

export function groupDisplay(tid) {

    getRandmR(tid, function(err, receiveData) {

        if(err) {
        }else {
            jQuery(window).resize(function(){
                csp.fixTableHead("js-random-results-table", "100%", "100%")
            });
            vueSelf.randmR = receiveData;
            jQuery(".js-random-output").attr("disabled",false)
            var x=$("[displayflag="+"'"+tid+"'"+"]")
            console.log("dedededededed");
            x.addClass("tname-click");
            x.parent().siblings().children().removeClass("tname-click");
            x.parent().parent().parent().siblings().children().children().children().removeClas
            getNamebyTid(tid,function(err,data) {
                 $(".js-unit-name").html("{单元名:" + data.trname);
                 $(".js-tid-name").html("小组名:" + data.tname);
                 $(".js-tid-bp").html("小组bp:" + data.t_bp);
                 $(".js-tid-allocated-value").html("分券市值:" + data.t_allocated_bp+"}");
            })
        }

    })
}


export function groupOutput(trid_id,tid_id) {
    unitRandmDiv(trid_id,maid,function(err,data) {
        if(data.leave) {
            console.log("总券有剩余～亲～")
        }
        else if(data.successOr) {
            console.log("tttttttttttt",data.successOr);
            groupDisplay(tid_id);
            delExchangeData(maid);
        }
    });
}

/**
 * @func
 * @desc 结果导出
 * @author ll
 */
//unit 单元id tid 小组id
export function randomOutput() {
        saveTidExcelFile.downloadFile(display_tid_now);
}

/**
* @desc 更新弹出层的显示状态
* @author luchenqun
* @param {String} className - 弹出层的类名
* @param {String} showState - 弹出层的显示状态
*/
export function updateModalState(className, showState) {
    jQuery('.' + className).modal(showState);
}

//在剩余总券中随机选择一只券
// export function randomSecurities(ItemPreDiv){
//     var securitiesTemp=[];
//     for (var i=0;i<ItemPreDiv.length;i++){
//         if(ItemPreDiv[i].amount){
//             securitiesTemp.push(ItemPreDiv[i]);
//         }
//     }
//     if(securitiesTemp.length>0){
//         var arrIndex = Math.floor(Math.random()*securitiesTemp.length);
//         return securitiesTemp[arrIndex];
//     }
//     else{
//         return securitiesTemp;
//     }
// }
// //满足愿望清单之后，剩余券的分配
// export function averageAllocated(ItemPreDiv,UnitWish){
//     var securitiesTempOne= randomSecurities(ItemPreDiv);
//     if(securitiesTempOne.amout===undefined){
//         return;
//     }
//     else{
//         while(securitiesTempOne.amout){
//             for (var i=0;i<ItemPreDiv.length;i++){
//                 if(ItemPreDiv[i].amount===securitiesTempOne.amout){
//                     while(ItemPreDiv[i].amount>=100){
//                         var times=ItemPreDiv[i].amount/100;
//                         var temp=checkUnitBp(ItemPreDiv[i],UnitWish);
//                         console.log("========",temp.length)
//                         if(temp.length){
//                             if(times>=temp.length){
//                                 //给选出来的小组都分配
//                                  allocateGroup(ItemPreDiv[i],temp,UnitWish);
//                                  ItemPreDiv[i].amount=Number(ItemPreDiv[i].amount)-100*temp.length;
//
//                             }
//                             else{
//                                 //随机选出times个组并对其进行分配
//                                 var randomTemp=randomTeams(times,UnitWish);
//                                 allocateGroup(ItemPreDiv[i],randomTemp,UnitWish);
//                                 ItemPreDiv[i].amount=Number(ItemPreDiv[i].amount)-100*times;
//                             }
//
//                         }
//                     }
//                 }
//             }
//             securitiesTempOne= randomSecurities(ItemPreDiv);
//         }
//     }
// }

</script>
