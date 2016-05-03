<!--
/**
* @file 心愿清单列表
* @author wangxiong
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
*/
-->
<template class="GroupWish">
    <div class="ui medium header">小组心愿清单</div>
    <div class="ui row">
        <widget-trid-dropdown v-ref:trid_dropdown></widget-trid-dropdown>
        <widget-tid-dropdown v-ref:tid_dropdown></widget-tid-dropdown>
    </div>
    <div class="data">
        <div class="trade-unit-stock">
        <div class="title">交易单元总券单</div>
        <div class="js-table-total"></div>
        <div class="trade-unit-stock-table container">
            <table class="ui celled striped table" id="left-table">
                <thead>
                    <tr class="js-head-center">
                        <th>序号</th>
                        <th>证券代码</th>
                        <th>证券名称</th>
                        <th>数量</th>
                        <th>市值</th>
                    </tr>
                </thead>
                <tbody class="js-left-tbody">
                </tbody>
            </table>
        </div>
        </div>
        <div class="group-wish-list">
        <div class="title">小组心愿清单</div>
        <div class="js-table-total">
            <div class="value-box">
                <div class="table-value js-market-value">市值:0.00</div>
                <div class="table-value js-bp-value">BP:0.00</div>
            </div>
            <button class="js-save-btn ui primary button" id="saveDataBtn" v-on:click="saveWishLists">保存</button>
        </div>
        <div class="group-wish-list-table js-table-container" >
            <table class="ui celled striped table" id="right-table">
                <thead class="js-right-head ui-widget-content">
                    <tr class="js-head-center">
                        <th>序号</th>
                        <th>证券代码</th>
                        <th>证券名称</th>
                        <th>数量</th>
                        <th>市值</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody class="js-right-table" >

                </tbody>
            </table>
        </div>
        </div>
    </div>
    <div class="ui small overBP modal">
        <div class="header">非法操作</div>
        <div class="content">
            <p>超过BP值</p>
        </div>
        <div class="actions ">
            <div class="ui two column centered grid">
                <div class="ui cancel button"><i class="remove icon"></i>取消</div>
            </div>
        </div>
    </div>
    <div class="ui inverted dimmer groupWish-view">
        <div class="ui text loader">Loading...</div>
    </div>
</template>

<style type="text/css">
    .GroupWish{
        height: 100%;
        width: 100%;
        padding-top:12px;
    }
    .js-widget-dropdown{
        width:100%
    }
    .value-box{
        width: 280px;
        margin: 0 auto;
        margin-top: -10px;
    }
    .table-value{
        float: left;
        line-height: 42px;
        font-size:14px;
        margin: 0 10px;
    }
    .js-save-btn {
        float: right;
    }
    .js-right-row .ui.input input,.right-float{
        text-align: right;
    }
    .trade-unit-stock .js-table-total{
        margin-top: -10px;
    }
    .trade-unit-stock {
        width: 50%;
        padding: 12px 15px 0 0;
        float: left;
        height: 100%;
    }

    .group-wish-list {
        width: 50%;
        padding: 12px 0 0 15px;
        float: left;
        height: 100%;
    }
    .trade-unit-stock-table{
        width: 100%;
        float: left;
        height: 100%;
    }
    .js-table-total {
        color: #FF0000;
        text-align: center;
        height: 42px;
    }

    .js-num-change {
        z-index: 1;
        margin-left: -20px;
        width: 18px;
        display: none;
    }

    .js-head-center {
        text-align: center;
    }

    .js-num-right {
        text-align: right;
        width:14%
    }
    .js-num-left {
        text-align: right;
    }
    .js-stock-num{
        width:100%
    }
    .js-amount-right{
        width:30%
    }
    .js-table-container,.trade-unit-stock-table.container{
        height: 75%;
        margin:0px 0;
        overflow:auto;
        box-shadow: 0 0 0 1px #e5e5e5 inset;
        border-radius: 5px;
        width:100%;
    }


</style>


<script server>


/**
 * @func getTidClient
 * @author lizhexi
 * @desc 获取小组
 */
export function getTidClient(postman,traderid){
    var selTid='SELECT tid FROM csp_team_member WHERE traderid ="'+traderid+'"'
    ison.db.query(selTid,function(err,data){
        console.log(selTid,"client selTid--->",data)

        if(err){
            postman({success:false,err:err})
        }else if(data[0] === undefined){
            postman({success:false,tid:0})
        }else{
            postman({success:true,tid:data[0].tid})
        }
    })
}
/**
* @desc 获取登录者的conlevel
* @func getConlevel
* @author lizhexi
*/
export function getConlevel(postman){
    var oid = postman.req.session.oid
    var retData={
        "error":false,
        "conlevel":'',
        "cellid":'',
        "oid":oid,
    }
    var conSQL = "SELECT max(conlevel) AS conlevel ,cellid FROM tsoper_conlevel WHERE "
               + "( conlevel= 2 OR conlevel =27 OR conlevel =28 OR conlevel =29) AND oid = '"
               + oid+"'";
    ison.db.query(conSQL,function(err,data){
        if(!err){
            console.log(conSQL,"------>")
            retData.conlevel = data[0].conlevel;
            retData.cellid = data[0].cellid;
            postman(retData);
        }else{
            retData.error = true;
            console.log("conlevel err-->",err)
            postman(retData)
        }
    })

}
/**
 * @func selGroupBPValue
 * @author lizhexi
 * @desc 查询BP值
 */
export function selGroupBPValue(tid,postman) {
    var ret ={
        "error" : false,
        "bpData" :'',
    }
    var selSQL = 'SELECT  SUM(bp) AS bp FROM tstrader AS a,csp_team_member AS b WHERE a.traderid =b.traderid AND a.trid = b.trid AND b.tid ='+tid;

   ison.db.query(selSQL,function(err,data){
       if(err){
           ret.error = true
           console.log("SELECT false")
           console.log(err);
           postman(ret)
       }else{

           if(data[0].bp===null){

               ret.bpData =0
                postman(ret)
           }else{
               ret.bpData = data[0].bp
                postman(ret)
           }



       }
   })
}

/**
 * @func getGroupBpValue
 * @author lizhexi
 * @desc 获取BP值
 */
export function getGroupBpValue(postman,tid){
        var ret={
            "error":false,
            "BPvalue" : 0.00,
            "msg":'',

        }
        //console.log("thistid--->",thistid)
        //console.log("tid-->",tid)
           selGroupBPValue(tid, function(data) {
               if (data.error) {
                   console.log("getGroupBPValue error!");
                   ret.error = true
                   ret.msg = '获取小组BP值失败，请重新进入此界面'
                   console.log("getGroupBPValue0--->",JSON.stringify(ret))
                   postman(ret)
               } else {
                   var bpData = data.bpData
                   ret.BPvalue = parseFloat(bpData).toFixed(2);
                   console.log("getGroupBPValue1--->",JSON.stringify(ret))
                   postman(ret)
               }
           });





}
/**
 * @func getUnitStocks
 * @author wangxiong
 * @desc 获取券表股票信息
 */
export function getUnitStocks(postman,trid) {
     var selSQL = 'SELECT a.code, a.cname, a.amount, b.preclose '
                + ' FROM csp_trid_securities AS a, tscode AS b'
                + ' WHERE left(b.cid,6) = a.code AND  b.cname = a.cname AND (b.tid ="3002" OR b.tid ="1001") AND a.trid = "'
                + trid +'"'
     ison.db.query(selSQL, function(err, data) {
         postman(err || data);
     })
}
/**
 * @func getGroupWishList
 * @author wangxiong
 * @desc 获取小组心愿清单
 */
export function getGroupWishList(postman,tid) {
    var ret ={
        "error" : false,
        "groupWishListdata"  : [],
    }

            var selSQL = 'SELECT a.cindex,a.code,a.cname,a.amount,b.preclose '
                       + 'FROM csp_group_wish_list AS a ,tscode AS b '
                       + ' WHERE a.code = b.code AND a.cname = b.cname AND a.tid ='+ tid
                       + ' ORDER BY cindex * 1 ASC';

            ison.db.query(selSQL, function(err, data) {
                    if(err){
                        ret.error = true;
                        console.log("getGroupWishList err---->",err)
                    }else{
                        ret.groupWishListdata = data;
                        //console.log(selSQL,"sel getGroupWishList ------>",data);
                    }
                    postman(ret)
                })

}
/**
 * @func submitWishList
 * @author wangxiong
 * @desc 提交小组心愿清单
 */
export function submitWishList(postman, valueStr,tid) {
    var delSQL = 'DELETE  FROM csp_group_wish_list WHERE tid ='+tid;

    ison.db.query(delSQL, function(err, data) {
        if(!err){
        //console.log(delSQL,"del data --->",data)
        var insSQL = 'INSERT INTO csp_group_wish_list(cindex,code,cname,amount,import_date,tid,maid,trid) VALUES'
        + valueStr;
        //console.log("insSql", insSQL);
        ison.db.query(insSQL, function(err, data) {
            if(err){
                console.log("ins err", err);
            }
            postman({})
        })
 }else{
    console.log("del err---->",err);
  }
  })
}
</script>

<!-- 前端代码，在浏览器中执行  -->
<script client>
var drapingId = "";
var isAddrow = false;
var BPvalue = 0;
var marketPrice = 0.00;
var flag;
var tid = 0
var maid = ''
var curTrid = ''
var curTid = 0
var curConlevel= 0
export function wishList() {
    this.stockIndex = "";
    this.stockNo = "";
    this.stockName = "";
    this.stockNum = "";
    this.marketVal = "";
}
/**
 * @var
 * @desc vue 事件(信号接收)
 * @author lizhexi
 */
export var  events = {
    'trid-changed': function (trid) {
        curTrid = trid
        refreshBP(0)
        refreshGroupWish(0)
        this.$refs.tid_dropdown.updateTid(0)
        this.$refs.tid_dropdown.updateDropdownList(curTrid)
        refreshUnitStocks(curTrid);
        console.log('------------>', curTrid)
    },
    'tid-changed': function (tid) {
        jQuery(".groupWish-view").addClass("active");
        curTid = tid
        refreshBP(curTid)
        refreshGroupWish(curTid)
        console.log('------------>', curTid)
    }
}
/**
 * @func refreshUnitStocks
 * @desc 刷新券表界面
 * @author lizhexi
 */
export function refreshUnitStocks(curTrid){
    getUnitStocks(curTrid,function(err, data) {
        if (err) {
            console.log("err----->",err)
        } else {
            clearTable("left-table")
            if (data.length >= 0) {
                var insertHtmlStr = '';
                for (var i = 0; i < data.length; i++) {
                    var index = i+1
                    var stockNo = data[i].code;
                    var stockName = data[i].cname;
                    var stockNum = data[i].amount;
                    var idStr = "left" + data[i].code;
                    var marketVal = parseFloat(stockNum*data[i].preclose).toFixed(2);
                    var tempInsertHtmlStr = '<tr class="js-left-table ui-widget-content" id="'
                                          + idStr + '"><td>'+index+'</td><td>' + stockNo + '</td><td>'
                                          + stockName + '</td><td class="js-num-left">'
                                          + stockNum + '</td><td class="js-num-left">'
                                          + marketVal + '</td></tr>';
                    insertHtmlStr += tempInsertHtmlStr;
                }
                if (insertHtmlStr.length > 0) {
                    //console.log("getUnitStocks insertHtmlStr--->", insertHtmlStr);
                    $(".js-left-tbody").append(insertHtmlStr);
                    //tableOperator();
                    //左边表格拖拽操作
                    dragLeftTable()
                }
            }
        }

        jQuery(".groupWish-view").removeClass("active");
    });
}
/**
 * @func refreshBP
 * @desc  刷新小组BP
 * @author lizhexi
 */
export function refreshBP(curTid){
    console.log("curBP tid-->",curTid);

    getGroupBpValue(curTid,function(err,data){
          if(data.error){
              if(curConlevel==2){
              csp.notify('notice', {
                  msg: '获取BP值失败',
                  delay: 15000,
              });
        }
          }else{

                  groupBP = data.BPvalue
                  BPvalue = groupBP
                  console.log("获取BP值成功")
               $(".js-bp-value").html("BP:" + formatNumber(groupBP,2));
          }
 })
}
/**
 * @func refreshGroupWish
 * @desc  刷新小组心愿清单
 * @author lizhexi
 */
export function refreshGroupWish(curTid){
    getGroupWishList(curTid,function(err,data) {
        if(!data.error){
            var rows = data.groupWishListdata
            clearTable("right-table")
            if (rows.length >= 0) {
                var insertHtmlStr = '';
                for (var i = 0; i < rows.length; i++) {
                    var stockNo = rows[i].code;
                    var stockName = rows[i].cname;
                    var stockNum = rows[i].amount;
                    var stockIndex = rows[i].cindex;
                    var marketVal = parseFloat(stockNum*rows[i].preclose).toFixed(2);
                    var idStr = "right" + rows[i].code;
                    var tempInsertHtmlStr = '<tr class="js-right-row" id="' + idStr + '"><td>' + stockIndex + '</td><td>'
                                    + stockNo + '</td><td>' + stockName + '</td><td class="js-amount-right">'
                                    + '<div class="ui icon input js-stock-num"><input type="text" value="'
                                    + stockNum + '" ><div class="js-num-change"><i class="caret up link icon"></i>'
                                    + '<i class="caret down link icon"></i></div></div></td><td class="js-num-right">'
                                    + marketVal + '</td>'
                                    + '<td><i class="trash outline big link icon" data-content="移除"></i>'
                                    + '</td></tr>';
                    insertHtmlStr += tempInsertHtmlStr;
                }
                if (insertHtmlStr.length > 0) {
                    $(".js-right-table").append(insertHtmlStr);
                     tableOperator();
                    updateCurMaketValue();

                }

                jQuery(".groupWish-view").removeClass("active");
            }

        }else{
            console.log("refreshGroupWish err---->",err)
        }
    });
}
/**
 * @func clearTable
 * @desc 清空表格
 * @author lizhexi
 * @param {string} idStr 想要清空的表格id
 */
function clearTable(idStr){
    var thistable = document.getElementById(idStr);
    var trs = thistable.getElementsByTagName("tr");
    for(var i = trs.length - 1; i > 0; i--) {
        thistable.deleteRow(i);
        if(i === 1){
            console.log("表格已被清空",i);
        }
    }

}
/**
 * @func refresh
 * @desc 刷新界面
 * @author lizhexi
 */
export function refresh(){
    var groupBP = 0.00
    var trDate = "";   //日期
    var traderId = ""; //交易员ID
    var self =this

            getConlevel(function(err,data){
                if(!data.error){
                  var oid = data.oid
                  maid = oid.split(".")[0]
                  curConlevel = data.conlevel
                  if(curConlevel == 29){
                      //获取用户券表数据
                      refreshUnitStocks(curTrid)
                      refreshBP(curTid)
                      refreshGroupWish(curTid)
                  }else{
                      curTrid = data.cellid
                      refreshUnitStocks(curTrid)
                      getTidClient(oid,function(err,data){
                          if(data.success){
                              curTid = data.tid
                              refreshBP(curTid)
                              refreshGroupWish(curTid)
                          }else{
                              if(data.err){
                                  console.log("err--->",data.err)
                              }else{
                                  console.log("未被分组")
                              }
                         }

                     })
                  }
              }else{
                   console.log("err--->",err);
              }
            })






}
export function ready() {
    var trDate = "";   //日期
    var traderId = ""; //交易员ID
    var self =this

    jQuery(".groupWish-view").addClass("active");
    refresh();
    tableOperator();

            getConlevel(function(err,data){

                if(!data.error){
                    var oid = data.oid
                    maid = oid.split(".")[0];
                    curConlevel = data.conlevel
                    if(curConlevel == 29){
                        curMaid = data.cellid
                        self.$refs.trid_dropdown.updateDropdownList(curMaid)
                    }else{
                        curTrid = data.cellid
                        self.$refs.trid_dropdown.updateTrid(curTrid)
                        if(curConlevel == 2 || curConlevel == 27){
                            getTidClient(oid,function(err,data){
                                if(data.success){
                                    curTid = data.tid
                                    self.$refs.tid_dropdown.updateTid(curTid)
                                }else{
                                    if(data.err){
                                        console.log("err--->",data.err)
                                    }else{
                                        console.log("未被分组")
                                    }
                               }

                           })
                        }else{
                            self.$refs.tid_dropdown.updateDropdownList(curTrid)
                        }
                    }
                }else{
                    console.log("err--->",err);
                }
            })



    jQuery(".js-table-container,.group-wish-list-table").droppable({
        drop: function(event, ui) {
            if (drapingId !== undefined && drapingId !== "" && drapingId !== null) {
                if (isAddrow) {
                    //增加一条记录
                    var leftRowObj = $('#left' + drapingId);
                    var rightRowObj = $('#right' + drapingId);
                    if (rightRowObj.length > 0) {
                        console.log("exist");
                        csp.notify('notice', {
                            msg: '该股票已存在于心愿清单，可进行数量更改或删除操作',
                            delay: 15000,
                        });
                        return ;
                    } else {
                        var calRlt = calCurMarketValue(drapingId, 100);
                        var cAmount = calCurUnitAmount(drapingId, 100);
                        if(cAmount){
                                    if (calRlt) {
                                        var rowObjs = $(leftRowObj).children();
                                        var stockNo = $(rowObjs[1]).html();
                                        var stockName = $(rowObjs[2]).html();
                                        var stockNum = $(rowObjs[3]).html();
                                        var marketVal = (100 * calStockUnitPrice(stockNo)).toFixed(2);
                                        var idStr = "right" + drapingId;
                                        var insertHtmlStr = '<tr class="js-right-row" id="' + idStr + '"><td>' + 0 + '</td><td>'
                                                        + stockNo + '</td><td>' + stockName + '</td><td class="js-amount-right">'
                                                        + '<div class="ui icon input js-stock-num"><input type="text" value="'
                                                        + 100 + '" ><div class="js-num-change"><i class="caret up link icon"></i>'
                                                        + '<i class="caret down link icon"></i></div></div></td><td class="js-num-right">'
                                                        + marketVal + '</td>'
                                                        + '<td><i class="trash outline big link icon" data-content="移除"></i>'
                                                        + '</td></tr>';
                                        var tableConObjs = $(this).children();
                                        var tableConObj = tableConObjs[0];
                                        var tableObjs = $(tableConObj).children();
                                        var tableObj = tableObjs[0];
                                        var tbodyObj = tableObjs[1];
                                        var bodyObjs = $(tableObj).next().children();
                                        if (bodyObjs.length > 0) {
                                            $(tbodyObj).append(insertHtmlStr);
                                        } else {
                                            $(tableObj).next().append(insertHtmlStr);
                                        }
                                        updateCurMaketValue();
                                    } else {
                                        //TODO 弹出对话框提示超过了BP值
                                        //$('.overBP.modal').modal('show');
                                        csp.notify('notice', {
                                            msg: '超出BP值,无法添加进心愿清单',
                                            delay: 15000,
                                        });
                                        console.log("超出BP值");
                                    }
                        }else{
                            console.log("ready 超过数量")
                            csp.notify('notice', {
                                msg: '该券在券表中数量不足100，无法添加进心愿清单',
                                delay: 15000,
                            });
                            console.log("超出券表中该支证券数量");
                            return ;
                        }
                    }
                }
                tableOperator();
                dealRightTableNo();
            }
        }
    });

    jQuery(".groupWish-view").addClass("active");
}

/**
 * @func saveWishLists
 * @desc 保存用户心愿清单数据
 * @author wangxiong lizhexi
 */
export function saveWishLists() {
    tid =curTid
    if(tid === 0){
        // csp.notify('notice', {
        //     msg: '您不属于任一小组，不能进行该操作',
        //     delay: 15000,
        // });
    }else if( (marketPrice-BPvalue)>0){
        csp.notify('notice', {
            msg: '心愿清单市值超过BP值，不能进行该操作',
            delay: 15000,
        });
    }else{
            //获取当前表格中的值
            var wishLists = new Array();
            var stockIndex = "";
            var stockNo = "";
            var stockName = "";
            var stockNum = "";
            var valueStr = "";
            var trdate = new Date().format("yyyyMMdd").toString();
            var rowObjs = $(".js-right-table").children();
            for (var i = 0; i < rowObjs.length; i++) {
                var tempWishList = new wishList();
                var rows = $(rowObjs[i]).children();
                tempWishList.stockIndex = $(rows[0]).text();
                tempWishList.stockNo = $(rows[1]).text();
                tempWishList.stockName = $(rows[2]).text();
                var stockNumRowObjs = $(rows[3]).children();
                var stockNumInputObjs = $(stockNumRowObjs[0]).children();
                var stockNumObj = $(stockNumInputObjs[0]);
                var stockunitAmount = calStockUnitAmount(tempWishList.stockNo);
                tempWishList.stockNum = $(stockNumObj).val();
                if(stockunitAmount < tempWishList.stockNum){
                    csp.notify('notice', {
                        msg: '心愿清单中存在证券数量超过券表中其对应数量的情况，请进行修改，否则不能进行该操作',
                        delay: 15000,
                    });
                    return ;
                }
                console.log("stockNumObj--->", tempWishList.stockNum);
                wishLists.push(tempWishList);
            }
            if (wishLists.length > 0) {
                var tempStr = '';
                for (var i = 0; i < wishLists.length; i++) {
                    tempStr += '("';
                    tempStr += wishLists[i].stockIndex;
                    tempStr += '","';
                    tempStr += wishLists[i].stockNo;
                    tempStr += '","';
                    tempStr += wishLists[i].stockName;
                    tempStr += '","';
                    tempStr += wishLists[i].stockNum;
                    tempStr += '","';
                    tempStr += trdate;
                    tempStr += '","';
                    tempStr += tid;
                    tempStr += '","';
                    tempStr += maid;
                    tempStr += '","';
                    tempStr += curTrid;
                    tempStr += '"),';
                }
                if (tempStr.length > 0) {
                    valueStr = tempStr.substring(0, tempStr.length - 1);
                }
                console.log("valueStr", valueStr);
            }
            submitWishList(valueStr, tid,function(err, reveiveData) {
                if(err){
                    console.log("submit--->",err)
                    csp.notify('notice', {
                        msg: '保存失败，请重试',
                        delay: 15000,
                    });
                } else {
                    csp.notify('notice', {
                        msg: '保存成功',
                        delay: 15000,
                    });
                }
            });
        }
}

/**
 * @func delayInputDeal
 * @desc 判断用户心愿清单输入是否为整百数，否则置为100
 * @author wangxiong
 */
export function delayInputDeal(data) {
    var curNumStr = $(data).val();
    var oldValue =$(data).attr("value");
    var dealNumStr = curNumStr.replace(/\D/g,'');
    console.log("oldVaue-->",oldValue,"dealNumStr-->",dealNumStr);
    $(data).val(dealNumStr);
    var stockNo = $(data).parent().parent().prev().prev().text();
    console.log("stockNo-->",stockNo)
        var tempStr = dealNumStr
        if (parseInt(tempStr) % 100 == 0) {
             var cAmount = calCurUnitAmount(stockNo, parseInt(tempStr));
                if(cAmount){
                     var rlt = calCurMarketValue(stockNo, parseInt(tempStr));
                        if(rlt) {
                           $(data).attr("value",dealNumStr)
                           console.log("cAmount--->",cAmount,"rlt-->",rlt,"替换成功",$(data).attr("value"));
                        }else{
                            $(data).val(oldValue);
                            csp.notify('notice', {
                                msg: '超出BP值，请重新确认数量',
                                delay: 15000,
                            });
                            console.log("超出BP值");
                        }
                    }else{
                        $(data).val(oldValue);
                        csp.notify('notice', {
                            msg: '超出券表中该支证券数量,请重新确认数量',
                            delay: 15000,
                        });
                        console.log("超出券表中该支证券数量");
                    }
        } else {
            //TODO modal
            csp.notify('notice', {
                msg: '请输入以100股为单位的数据',
                delay: 15000,
            });
            $(data).val(oldValue);
        }
        var unitPrice = calStockUnitPrice(stockNo);
        tempStr = $(data).val();
        var curVal = (parseInt(tempStr) * unitPrice).toFixed(2);
        $(data).parent().parent().next().html(curVal);
        updateCurMaketValue();

}
/**
 * @func dragLeftTable
 * @desc 左表拖动
 * @author wangxiong
 */
export function dragLeftTable(){
    //左边表格拖拽操作
    jQuery(".js-left-table").draggable({
        cursor: "move",
        cursorAt: { top: -2, left: -2 },
        helper: "clone",
        start: function() {
            var rows = $(this).children();
            var stockNo = $(rows[1]).html();
            drapingId = stockNo;
            isAddrow = true;
        }
    });
}

/**
 * @func tableOperator
 * @desc 操作心愿单
 * @author wangxiong
 */
export function tableOperator() {
        dragLeftTable()
        jQuery(".js-right-row").draggable({
            cursor: "move",
            cursorAt: { top: -2, left: -2 },
            helper: "clone",
            start: function() {
                var rows = $(this).children();
                var stockNo = $(rows[1]).html();
                drapingId = stockNo;
                isAddrow = false;
            }
        });
        //数量增加100
        jQuery(".caret.up.link").unbind("click").click(function() {
            var curNumStr = $(this).parent().prev().val();
            if (curNumStr == null || curNumStr == undefined || curNumStr == '') {
                curNumStr = '0';
            }
            var stockNo = $(this).parent().parent().parent().prev().prev().html();
            var stockInput = $(this).parent().prev().val();
            console.log("curNumStr", curNumStr);
            console.log("stockNo", stockNo);
            console.log("stockInput", stockInput);
             var rlt = calCurMarketValue(stockNo, parseInt(stockInput) + 100);
             var cAmount=calCurUnitAmount(stockNo, parseInt(stockInput) + 100);
            if(cAmount){
                    if (rlt) {
                        console.log("数量增加成功-->", stockNo);
                        var curNum = 0;
                        //使input内数据整百出现
                        if (parseInt(curNumStr) % 100 == 0) {
                            curNum = parseInt(curNumStr) + 100;
                            console.log("curNum--->",curNum)
                        } else {
                            curNum = parseInt(curNumStr) + (100 - parseInt(curNumStr) % 100);
                            console.log("curNum--->",curNum)
                        }
                        $(this).parent().prev().val(curNum);
                        var unitPrice = calStockUnitPrice(stockNo);
                        var curVal = (curNum * unitPrice).toFixed(2);

                        $(this).parent().parent().parent().next().html(curVal);
                    } else {
                        //TODO 对话框
                        //$('.overBP.modal').modal('show');
                        //alert("超过BP值")
                        csp.notify('notice', {
                            msg: '超出BP值，请重新确认心愿清单',
                            delay: 15000,
                        });
                        console.log("超出BP值");
                        console.log("数量增加失败-->", stockNo);
                    }
               }else{
                   csp.notify('notice', {
                       msg: '超出券表中该支证券数量,请重新确认数量',
                       delay: 15000,
                   });
                   console.log("超出券表中该支证券数量");
               }
            updateCurMaketValue();
        });

        //数量减少100
        jQuery(".caret.down.link").unbind("click").click(function() {
            var stockNo = $(this).parent().parent().parent().prev().prev().html();
            var curNumStr = $(this).parent().prev().val();
            var curNum = 0;
            var rlt = calCurMarketValue(stockNo, parseInt(curNumStr) - 100);
            if (rlt) {
                    if (parseInt(curNumStr) % 100 == 0) {
                        curNum = parseInt(curNumStr) - 100;
                        console.log("stockNo--->",stockNo)
                        console.log("curNum--->",curNum)
                    } else {
                        curNum = parseInt(curNumStr) - parseInt(curNumStr) % 100;
                        console.log("stockNo--->",stockNo)
                        console.log("curNum--->",curNum)
                    }
                    if (curNum >= 0) {
                        $(this).parent().prev().val(curNum);
                        var unitPrice = calStockUnitPrice(stockNo);
                        var curVal = (curNum * unitPrice).toFixed(2);
                        $(this).parent().parent().parent().next().html(curVal);
                    } else if (curNum >= -99) {
                        $(this).parent().prev().val(0);
                        $(this).parent().parent().parent().next().html(0);
                    }
            }else {
                //TODO 对话框
                $('.overBP.modal').modal('toggle');
            }
            updateCurMaketValue();
        });

        //防止非法字符
        jQuery("input").focus(function(){
            var inputObj = this
            var $inputObj = $(inputObj)
            var oldValue = $inputObj.attr("value")
            var isEnter = false
            var i = 1
            var m = 1
                $inputObj.off("keyup").on("keyup",function(event) {
                    m++;
                    if(event.keyCode == "13"){
                        isEnter = true
                        i=0;
                        $inputObj.unbind("blur").blur(function(){
                            delayInputDeal(inputObj);
                            //console.log("yes")

                        })
                        $inputObj.blur();

                    }else{
                        i++;
                    }
                });

                    $inputObj.unbind("blur").blur(function(){
                         if(i == m || i > m){
                              $inputObj.val(oldValue)
                              //console.log("i-->",i,"m-->",m)
                             // console.log("not")
                          }else{

                          }
                  })

        })
        //隐藏按钮、显示按钮
        jQuery(".input").on("mouseenter mouseleave", function(event) {
            var $me = $(this);
            if( event.type == "mouseenter"){
                $(this).children(".js-num-change").show();
            }else if(event.type == "mouseleave" ){
                 $(this).children(".js-num-change").hide();
            }
        });

        //删除记录
        jQuery(".trash, .outline").on("click", function() {
            $(this).parent().parent().remove();
            dealRightTableNo();
            updateCurMaketValue();
        });


// //右边拖动自行处理
jQuery(".js-right-row").droppable({
    accept:".js-right-row ",
    drop: function(event, ui) {
        if (drapingId !== undefined && drapingId !== "" && drapingId !== null) {

                //移动一条记录
                var dragRowObj = $('#right' + drapingId);
                var htmlStr = $(dragRowObj).html();
                var rowObjs = $(dragRowObj).children();
                var stockNo = $(rowObjs[1]).html();
                var stockName = $(rowObjs[2]).html();
                var stockNum1 = $(rowObjs[3]).children();
                var stockNum2 = $(stockNum1[0]).children();
                var stockNum = $(stockNum2[0]).val();
                var marketVal = $(rowObjs[4]).html();
                var idStr = "right" + drapingId;

                var insertHtmlStr = '<tr class="js-right-row" id="' + idStr + '"><td>' + 0 + '</td><td>'
                                + stockNo + '</td><td>' + stockName + '</td><td class="js-amount-right">'
                                + '<div class="ui icon input js-stock-num"><input type="text" value="'
                                + stockNum + '" ><div class="js-num-change"><i class="caret up link icon"></i>'
                                + '<i class="caret down link icon"></i></div></div></td><td class="js-num-right">'
                                + marketVal + '</td>'
                                + '<td><i class="trash outline big link icon" data-content="移除"></i>'
                                + '</td></tr>';
                var curRow = this;
                var parentObj = $(curRow);
                var pId = $(parentObj).attr("id");
                console.log("----->", pId);
                console.log("--->", 'right' + drapingId);
                if (pId == undefined || pId == "" || pId == null || pId === ('right' + drapingId)) {
                    return ;
                } else {
                    $(curRow).before(insertHtmlStr);
                    $(dragRowObj).remove();
                }
            tableOperator();
            dealRightTableNo();
        }
    }
});
}
/**
 * @func dealRightTableNo
 * @desc 处理右表编号
 * @author wangxiong
 */
export function dealRightTableNo() {
    var rowObjs = $(".js-right-table").children();
    for (var i = 0; i < rowObjs.length; i++) {
        var rows = $(rowObjs[i]).children();
        var rowNo = rows[0];
        $(rowNo).text(i + 1);
    }
}



/**
 * @func calStockUnitPrice
 * @desc 计算股票价格
 * @author wangxiong
 */
export function calStockUnitPrice(stockNo) {
    var leftRowObj = $('#left' + stockNo);
    var leftrowObjs = $(leftRowObj).children();
    var unitPrice = parseFloat($(leftrowObjs[4]).text() / $(leftrowObjs[3]).text());
    return unitPrice;
}
/**
 * @func calStockUnitAmount
 * @desc 计算股票数量
 * @author lizhexi
 */
export function calStockUnitAmount(stockNo) {
    var leftRowObj = $('#left' + stockNo);
    var leftrowObjs = $(leftRowObj).children();
    var unitAmount = parseInt($(leftrowObjs[3]).text());
    return unitAmount;
}
/**
 * @func calCurMarketValue
 * @desc 判断心愿清单市值是否超过BP
 * @author wangxiong
 * @param Boolean  rlt  false-超过不可继续操作 true-未超过可继续操作
 */
export function calCurMarketValue(stockNo, stockNum) {
    var rlt = false;
    var unitPrice = calStockUnitPrice(stockNo);
    var curTotalVal = 0.0;
    var rowObjs = $(".js-right-table").children();
    for (var i = 0; i < rowObjs.length; i++) {
        var rows = $(rowObjs[i]).children();
        if (stockNo === $(rows[1]).text()) {
            continue;
        }
        var marketValObj = rows[4];
        var marketVal = $(marketValObj).text();
        curTotalVal += parseFloat(marketVal);
    }
    if (curTotalVal + stockNum * unitPrice > BPvalue) {
        rlt = false;
    }else{
        rlt = true;
    }
    return rlt;
}
/**
 * @func calCurUnitAmount
 * @desc 判断心愿清单某支股票数量是否超过券表中数量
 * @author lizhexi
 * @param Boolean  rlt  false-超过不可继续操作 true-未超过可继续操作
 */
export function calCurUnitAmount(stockNo, stockNum) {
    var rlt = false;
    var unitAmount = calStockUnitAmount(stockNo);
    if (stockNum >unitAmount) {
        rlt = false;
    }else{
        rlt = true;
    }
    return rlt;
}
/**
 * @func updateCurMaketValue
 * @desc 更新心愿清单总市值
 * @author wangxiong
 */
export function updateCurMaketValue() {
    var curTotalVal = 0.0;
    var rowObjs = $(".js-right-table").children();
    for (var i = 0; i < rowObjs.length; i++) {
        var rows = $(rowObjs[i]).children();
        var marketValObj = rows[4];
        var marketVal = $(marketValObj).text();
        curTotalVal += parseFloat(marketVal);
        var cnameObj = rows[2];
        var cname=$(cnameObj).text();
    }
    marketPrice = curTotalVal.toFixed(2)
    var curTotalValStr = "市值:" + formatNumber(curTotalVal,2);

    $(".js-market-value").html(curTotalValStr);
    // if(curTotalVal > BPvalue){
    //     csp.notify('notice', {
    //         msg: '心愿清单市值超过BP值',
    //         delay: 15000,
    //     });
    // }
}



function format (num) {
    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
/**
 * @func formatNumber
 * @desc 格式化数字
 * @param {number} num 需要被格式化的数字
 * @param {int} precision 格式化后的精度
 * @author lizhexi
 */
function formatNumber(num, precision) {
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');

        return parts.join('.');
    }
    return NaN;
}
function unformat(str){
    var num =str.split(",")
    return num.join();
}


</script>
