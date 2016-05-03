
<template class="TridTrade">
    <div class="header">
        <h3 style="float:left">交易单元交易明细表(TRD001)</h3>
        <div class="ui icon input" style="float: right;">
            <input class="search-keyword" type="text" placeholder="请过滤后精确查询" >
            <i class="search icon"></i>
        </div>
    </div>

    <div class="data-container">
        <div class="data">
            <p class="title">交易单元交易明细</p>
            <div class="ui above">
                <widget-trid-dropdown v-ref:trid_dropdown></widget-trid-dropdown>
                <div class="ui dropdown date js-date-condition" style="z-index:101">
                    <input type="hidden" name="above-date">
                    <div class="text">查看多天</div>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <div class="item" data-value="multiple-day">查看多天</div>
                        <div class="item" data-value="singal-day">只查一天</div>
                    </div>
                </div>
                <div class="ui icon input">
                    <input class="js-date-begin" type="text" readonly="readonly">
                    <i class="calendar outline icon"></i></div>
                <span>-</span>
                <div class="ui icon input">
                    <input class="js-date-end" type="text" readonly="readonly">
                    <i class="calendar outline icon"></i>
                </div>
                <!-- 过滤条件 -->
                <div class="ui compact multiple selection dropdown js-order-condition" style="z-index:100">
                    <input type="hidden" name="filters">
                    <i class="dropdown icon"></i>
                    <span class="default text" style="font-family:SimSun;color:#999">   订单状态过滤</span>
                    <div class="menu">
                        <div class="scrolling menu">
                            <div class="item" data-value="has-trade">
                                <div class="ui red empty circular label"></div>
                                有成交
                            </div>
                            <div class="item" data-value="has-all-trade">
                                <div class="ui blue empty circular label"></div>
                                全部成交
                            </div>
                            <div class="item" data-value="has-cancel">
                                <div class="ui black empty circular label"></div>
                                有撤单
                            </div>
                            <div class="item" data-value="has-trade-and-cancel">
                                <div class="ui purple empty circular label"></div>
                                有撤单成交
                            </div>
                            <div class="item" data-value="has-over-order">
                                <div class="ui orange empty circular label"></div>
                                完结订单
                            </div>
                        </div>
                    </div>
                </div>

                <button class="ui primary button" v-on:click="updateView">查&nbsp;询 </button>
                <button class="ui button" v-on:click="exportExcel">导&nbsp;出 </button>

                <div class="table-container">
                    <table id="js-trid-trade-table" class="ui single line selectable striped table">
                        <thead id="fix-header">
                            <tr>
                            <th style="text-align:center">序号</th>
                            <th style="text-align:center">交易日</th>
                            <th style="text-align:center">交易单元</th>
                            <th style="text-align:center">交易员</th>
                            <th style="text-align:center">证券代码</th>
                            <th style="text-align:center">证券名称</th>
                            <th style="text-align:center">资产账户</th>
                            <th style="text-align:center">终端订单号</th>
                            <th style="text-align:center">交易单元订单号</th>
                            <th style="text-align:center">买卖类型</th>
                            <th style="text-align:center">业务名称</th>
                            <th style="text-align:center">发单时间</th>
                            <th style="text-align:center">补单标记</th>
                            <th style="text-align:center">撤单时间</th>
                            <th style="text-align:center">撤单数量</th>
                            <th style="text-align:center">委托价格</th>
                            <th style="text-align:center">委托数量</th>
                            <th style="text-align:center">成交数量</th>
                            <th style="text-align:center">成交金额</th>
                            <th style="text-align:center">成交均价</th>
                            <th style="text-align:center">平仓属性</th>
                            <th style="text-align:center">平仓数量</th>
                            <th style="text-align:center">平仓金额</th>
                            <th style="text-align:center">印花税</th>
                            <th style="text-align:center">过户费</th>
                            <th style="text-align:center">佣金</th>
                            <th style="text-align:center">其他费</th>
                            <th style="text-align:center">买入发生金额</th>
                            <th style="text-align:center">卖出发生金额</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in signalDataCells" >
                          <td>{{$index + 1 + (currentPage-1) * 15}}</td>
                          <td>{{item.trday}}</td>
                          <td>{{item.trid}}</td>
                          <td>{{item.traderid}}</td>
                          <td>{{item.cid}}</td>
                          <td>{{item.cname}}</td>
                          <td>{{item.acid}}</td>
                          <td >{{item.termorderid}}</td>
                          <td>{{item.trd_orderid}}</td>
                          <td style="text-align:center">{{item.side}}</td>
                          <td>{{item.cmdname}}</td>
                          <td>{{item.ordertm}}</td>
                          <td style="text-align:center">{{item.act_orderid}}</td>
                          <td style="text-align:center">{{item.cancelordertm}}</td>
                          <td style="text-align:right">{{item.cancelvol}}</td>
                          <td style="text-align:right">{{item.price}}</td>
                          <td style="text-align:right">{{item.volume}}</td>
                          <td style="text-align:right">{{item.tradevol}}</td>
                          <td style="text-align:right">{{item.tradeamt}}</td>
                          <td style="text-align:right">{{item.tradeamtaver}}</td>
                          <td style="text-align:center">{{item.overnighttype}}</td>
                          <td style="text-align:right">{{item.overnighttrdvol}}</td>
                          <td style="text-align:right">{{item.overnighttrdamt}}</td>
                          <td style="text-align:right">{{item.taxfee}}</td>
                          <td style="text-align:right">{{item.transfee}}</td>
                          <td style="text-align:right">{{item.commissionfee}}</td>
                          <td style="text-align:right">{{item.otherfee}}</td>
                          <td style="text-align:right">{{item.buyamt}}</td>
                          <td style="text-align:right">{{item.sellamt}}</td>
                      </tr>
                        </tbody>
                    </table>
                </div>
                <widget-pagination v-ref:pagination></widget-pagination>
            </div>



            <p class="title">汇总数据</p>
            <div class="ui segment below">
                <div class="ui large horizontal divided list">
                    <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.sumtradeamt}}</div>
                        <div class="label">成交总金额</div>
                    </div>
                    </div>
                    <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.sumtaxfee}}</div>
                        <div class="label">总印花税</div>
                    </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumtransfee}}</div>
                            <div class="label">总过户费</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumcommissionfee}}</div>
                            <div class="label">总佣金</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumotherfee}}</div>
                            <div class="label">总其他费</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumbuyamt}}</div>
                            <div class="label">买入发生金额</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumsellamt}}</div>
                            <div class="label">卖出发生金额</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumclosepl}}</div>
                            <div class="label">总盈亏</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumtotalclosepl}}</div>
                            <div class="label">总净盈亏</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui  dimmer tridTradeTab">
                <div class="ui text loader">正在查询……</div>
            </div>
        </div>

    </div>
</template>

<style>
.TridTrade{
    height: 100%;
    width: 100%;
    padding-top:12px;
}
.ui.divided.list .item{
        width: 10.8%;
        text-align: center;
 }
.ui.table thread th{
    text-align: center;
}

</style>

<script server>
/**
* @desc 更新数据
* @author lizhexi
* @param {Object} postman   - 推送的数据对象
* @param {Object} inPutParm - 输入的数据(即查询条件)
*/
export function updateData(postman, inPutParm){
     var ret = {
            "error": false,
            "signalDataCells": [],
            "totalDataCell": {},
            "pageCount": 0,
        };
    var querySql = "";

    if(inPutParm.orderstat != undefined){
        querySql = "CALL pr_trd001('"+inPutParm.trid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"','"+inPutParm.orderstat+"')";
    } else {
        querySql = "CALL pr_trd001('"+inPutParm.trid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"',null)";
    }

    ison.db.query(querySql, function(err, rows, fields){
        if(err){
            ret.error = true
            postman(ret)
        }else{
            var rowRet = rows[0];

            //从ta_hold_his中查询到股票的当天总盈亏、总净盈亏
             querySql = "SELECT MID(cid, 1, 6) AS cid, closepl AS sumclosepl, trday, totalfee, (closepl - totalfee) AS sumtotalclosepl FROM ta_hold_his"
                    + " WHERE trday >= '" + inPutParm.begindate + "' AND trday <= '" + inPutParm.enddate
                   + "' AND celltype = 'trid' AND cellid = '" + inPutParm.trid + "' GROUP BY trday, cid"
             console.log("SelectTradeDetail-->select total data sql: "+querySql );
             ison.db.query(querySql,function(err, rows){
                 if(err){

                     ret.error = true
                     postman(ret)
                 }else{

                     var totalData_rows = rows;
                     if(totalData_rows.length > 0){
                         for(var i=0; i<rowRet.length; i++){
                             for(var k=0; k<totalData_rows.length; k++){
                                 var find = false;
                                 if(rowRet[i].trday === totalData_rows[k].trday && rowRet[i].cid.substr(0,6) === totalData_rows[k].cid){
                                     rowRet[i].sumclosepl = totalData_rows[k].sumclosepl;
                                     find = true;
                                     break;
                                 }
                             }

                             if(!find) {
                                 rowRet[i].sumclosepl = 0.00;
                                 rowRet[i].totalfee = 0.00
                             }
                         }
                    }
                    if(inPutParm.page != undefined && inPutParm.pageCount != undefined){
                        formatData(rowRet)   //格式化数据
                        var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
                        ret.signalDataCells = retData.detail_data
                        ret.totalDataCell = retData.total_data
                        ret.pageCount = retData.pages
                    } else{
                        ret.error = true
                    }
                    postman(ret)
                 }
              });
           }
      });
}
/**
* @desc 判断是否是一个非数字
* @author luchenqun
* @param {Object} data       - 数据
* @returns {Boolean}         - true:不是一个数字，false:是一个数字
*/
function notNum(data){
    if(data === null){
        return true
    }
    return isNaN(data)
}
/**
 * @desc 将存储过程查出来的字段与之前SQL字段对应
 * @author lizhexi
 * @param {Array} data       -存储过程查询得到的字段
 * @param {Array} formatData -转换后得到的数据
 */
 function formatData(data){
    for(var i=0; i<data.length; i++){
    data[i].cid = data[i].cid.substr(0,6);
    data[i].price = parseFloat(data[i].price).toFixed(2);
    data[i].tradeamt = parseFloat(data[i].tradeamt).toFixed(2);
    data[i].overnighttrdamt = parseFloat(data[i].overnight_trd_amt).toFixed(2);
    data[i].taxfee = parseFloat(data[i].taxfee).toFixed(2);
    data[i].transfee = parseFloat(data[i].transfee).toFixed(2);
    data[i].commissionfee = parseFloat(data[i].commissionfee).toFixed(2);
    data[i].otherfee = parseFloat(data[i].otherfee).toFixed(2);
    data[i].tradeamtaver = parseFloat(data[i].avgprc).toFixed(2);
    data[i].buyamt = parseFloat(data[i].b_amt).toFixed(2);
    data[i].sellamt = parseFloat(data[i].s_amt).toFixed(2);
    data[i].overnighttype = data[i].overnight_type;
    data[i].volume = notNum(data[i].volume)? 0 : parseInt(data[i].volume).toString();
    data[i].cancelvol = notNum(data[i].cancelvol) ? 0 : parseInt(data[i].cancelvol).toString();
    data[i].tradevol = notNum(data[i].tradevol) ? 0 : parseInt(data[i].tradevol).toString();
    data[i].overnighttrdvol = notNum(data[i].overnight_trd_vol)?0 : parseInt(data[i].tradevol).toString();


    if(data[i].addorder_type){
        data[i].act_orderid = data[i].addorder_type;
    }else{
        data[i].act_orderid = data[i].supplement_flag;
    }
}


}
/**
* @desc 数据过滤
* @author lizhexi
* @param {Object} orgData   - 查询出来的所有订单数据
* @param {Int} page         - 请求的页码
* @param {Int} pageCount    - 请求分页的条数
* @param {String} keyWord   - 关键字过滤
*/
function filterSelData(orgData, page, pageCount, keyWord){
    var filterData= [] ;   // 过滤后的数据
    if(typeof keyWord === 'undefined' || keyWord === ''){
        filterData = orgData
    } else{

        for(var i=0; i<orgData.length; i++){
            if(orderKeyFilter(orgData[i], keyWord)){
                filterData.push(orgData[i])
            }
        }
    }

    //初始化总计数据
    var totalDataCell = {};
    totalDataCell.sumtradeamt = parseFloat(0.00);
    totalDataCell.sumtaxfee = parseFloat(0.00);
    totalDataCell.sumtransfee = parseFloat(0.00);
    totalDataCell.sumcommissionfee =parseFloat(0.00);
    totalDataCell.sumotherfee = parseFloat(0.00);
    totalDataCell.sumbuyamt = parseFloat(0.00);
    totalDataCell.sumsellamt = parseFloat(0.00);
    totalDataCell.sumclosepl = parseFloat(0.00);
    totalDataCell.sumtotalclosepl = parseFloat(0.00);


    for(var i=0; i<filterData.length; i++){
        totalDataCell.sumtradeamt +=(!isNaN(filterData[i].tradeamt) ? parseFloat(filterData[i].tradeamt) : 0);
        totalDataCell.sumtaxfee += (!isNaN(filterData[i].taxfee) ? parseFloat(filterData[i].taxfee): 0);
        totalDataCell.sumtransfee += (!isNaN(filterData[i].transfee) ? parseFloat(filterData[i].transfee): 0);
        totalDataCell.sumcommissionfee += (!isNaN(filterData[i].commissionfee) ? parseFloat(filterData[i].commissionfee): 0);
        totalDataCell.sumotherfee += (!isNaN(filterData[i].otherfee) ?  parseFloat(filterData[i].otherfee): 0);
        totalDataCell.sumbuyamt += (!isNaN(filterData[i].buyamt) ?  parseFloat(filterData[i].buyamt): 0);
        totalDataCell.sumsellamt += (!isNaN(filterData[i].sellamt) ? parseFloat(filterData[i].sellamt): 0);



    }

    // 总盈亏
    var tmp_pl_Obj = {};  // 同一天，同一只股票的总盈亏，总净盈亏只算一次,因为每条数据都是一样的，总盈亏,ex:{"20160113-600031":105.23,"20160113-000002":80.90}
    for(var i=0; i<filterData.length; i++){
        tmp_pl_Obj[filterData[i].trday + "-" + filterData[i].cid] = filterData[i].sumclosepl; // 每只股票，当日的总盈亏

    }
    for(var obj in tmp_pl_Obj){
        totalDataCell.sumclosepl += parseFloat(tmp_pl_Obj[obj]);
    }

    //总净盈亏:总盈亏-总费用
    totalDataCell.sumtotalclosepl = totalDataCell.sumclosepl
                                        -totalDataCell.sumtaxfee
                                        -totalDataCell.sumtransfee
                                        -totalDataCell.sumcommissionfee
                                        -totalDataCell.sumotherfee;

    for(var obj in totalDataCell){
        totalDataCell[obj]= parseFloat(totalDataCell[obj]).toFixed(2);
    }

    var retData = {};
    retData.total_data = totalDataCell;                             // 统计数据
    retData.pages = Math.ceil(parseFloat(filterData.length/pageCount))  // 总页码
    retData.detail_data = pageDataGet(filterData, page, pageCount);     // 过滤数据

    return retData;
}

/**
* @desc 订单关键字过滤
* @author luchenqun lubaolin
* @param {Object} order    - 查询出来的所有订单数据
* @param {String} keyWord  - 请求的当前页码
*/
function orderKeyFilter(order, keyWord){
    return (order.trday.toString().match(keyWord)
        || order.cid.toString().match(keyWord)
        || order.cname.toString().match(keyWord)
        || order.side.toString().match(keyWord)
        || order.ordertm.toString().match(keyWord)
        || order.cancelordertm.toString().match(keyWord)
        || order.trd_orderid.toString().match(keyWord)
        || order.traderid.toString().match(keyWord)
        || order.trid.toString().match(keyWord)
        || order.cmdname.toString().match(keyWord)
        || order.act_orderid.toString().match(keyWord));

}

/**
* @desc 从查询出来的数据中截取某一页的数据
* @author luchenqun lubaolin
* @param {Array} allData    - 查询出来的所有订单数据
* @param {Int} current_page - 请求的当前页码
* @param {Int} pageCount    - 请求分页的条数
*/
function pageDataGet(allData, current_page, pageCount){
    var currentStartCount = (current_page - 1) * pageCount;
    var tmpDisplayData = [];

    if(allData.length > currentStartCount+pageCount){
        tmpDisplayData = allData.slice(currentStartCount, currentStartCount+pageCount);
    } else {
        tmpDisplayData = allData.slice(currentStartCount, allData.length);
    }
    return tmpDisplayData;
}
/**
* @desc 从登录session获取maid
* @func getMaid
* @author lizhexi
*/
export function getMaid(postman){

    postman({maid:postman.req.session.maid});
}

/**
* @desc 更新数据
* @author luchenqun lizhexi
* @param {Object} postman   - 推送的数据对象
* @param {Object} inPutParm - 输入的数据(即查询条件)
*/
export function saveExcelFile(postman, inPutParm){
    var sql = "";
    if(inPutParm.orderstat != undefined){
        sql = "CALL pr_trd001('"+inPutParm.trid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"','"+inPutParm.orderstat+"')";
    } else {
        sql = "CALL pr_trd001('"+inPutParm.trid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"', null)";
    }

    ison.db.query(sql, function(err, rows, fields) {
        if(!err){
//数据查询及处理
            var rowRet = rows[0]
            //从ta_hold_his中查询到股票的当天总盈亏、总净盈亏
            var querySql = "SELECT MID(cid, 1, 6) AS cid, closepl AS sumclosepl, trday, totalfee FROM ta_hold_his"
                    + " WHERE trday >= '" + inPutParm.begindate + "' AND trday <= '" + inPutParm.enddate
                   + "' AND celltype = 'trid' AND cellid = '" + inPutParm.trid + "' GROUP BY trday, cid"
       ison.db.query(querySql,function(err, rows){
                          if(!err){
                               var totalData_rows = rows;

                              if(totalData_rows.length > 0){
                                  for(var i=0; i<rowRet.length; i++){
                                      for(var k=0; k<totalData_rows.length; k++){
                                          var find = false;
                                          if(rowRet[i].trday === totalData_rows[k].trday && rowRet[i].cid.substr(0,6) === totalData_rows[k].cid){
                                              rowRet[i].sumclosepl = totalData_rows[k].sumclosepl;
                                              find = true;
                                              break;
                                          }
                                      }
                                      if(!find) {
                                          rowRet[i].sumclosepl = 0.00;
                                          rowRet[i].totalfee=0.00
                                      }
                                  }
                             }
                             if(inPutParm.page != undefined && inPutParm.pageCount != undefined){
                                 formatData(rowRet)
                                 var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
                                 var totalDataCell = retData.total_data

                                 var cols = []
                                 var rows = []
                     //写入表格
                                 var titles = [
                                     "序号","交易日","交易单元","交易员","证券代码",
                                     "证券名称","资产账户","终端订单号","交易单元订单号","买卖类型",
                                     "业务名称","发单时间","补单标记","撤单时间","撤单数量",
                                     "委托价格","委托数量","成交数量","成交金额","成交均价",
                                     "平仓属性","平仓数量","平仓金额","印花税","过户费",
                                     "佣金","其它费","买入发生金额","卖出发生金额",
                                 ]
                                 var totalTitles = [
                                     "成交总金额","总印花税","总过户费","总佣金","总其他费",
                                     "买入发生金额","卖出发生金额","总盈亏","总净盈亏",
                                 ]

                               //规定列数和类别
                                 for(var i=0; i<titles.length; i++){
                                     var item = {}
                                     item.caption = '';
                                     item.type = 'string'
                                     cols.push(item)
                                 }
                                 //空白行
                                 var blankRow =[]
                                 for(var k=0;k<titles.length;k++){
                                         blankRow.push('')
                                     }
                                 //查询时间及表名
                                 var item = []
                                 item[0]="交易单元交易明细表(TRD001)"
                                 item[1]="开始查询时间："
                                 item[2]=inPutParm.begindate;
                                 item[3]="结束查询时间："
                                 item[4]=inPutParm.enddate
                                 for(var i=5;i<titles.length;i++){
                                     item.push('')
                                 }
                                 rows.push(item)
                                 rows.push(blankRow)
                                 //写入汇总数据
                                 var totalTitleItem = []
                                 for(var i=0;i<titles.length;i++){
                                     if(i<totalTitles.length){
                                         totalTitleItem.push(totalTitles[i])
                                     }else{
                                         totalTitleItem.push('')
                                     }
                                 }
                                 rows.push(totalTitleItem);
                                 var totalDataItem =[]
                                 totalDataItem.push(totalDataCell.sumtradeamt);
                                 totalDataItem.push(totalDataCell.sumtaxfee);
                                 totalDataItem.push(totalDataCell.sumtransfee);
                                 totalDataItem.push(totalDataCell.sumcommissionfee);
                                 totalDataItem.push(totalDataCell.sumotherfee);
                                 totalDataItem.push(totalDataCell.sumbuyamt);
                                 totalDataItem.push(totalDataCell.sumsellamt);
                                 totalDataItem.push(totalDataCell.sumclosepl);
                                 totalDataItem.push(totalDataCell.sumtotalclosepl);
                                 for(var i=totalTitles.length;i<titles.length;i++){
                                     totalDataItem.push('')
                                 }
                                 rows.push(totalDataItem)
                                 rows.push(blankRow)
                                 //交易单元明细数据
                                 var titleItem =[]
                                 for(var i=0;i<titles.length;i++){
                                     titleItem.push(titles[i])
                                 }
                                 rows.push(titleItem);
                                 for(var i=0; i<rowRet.length; i++){
                                     var item = []
                                     item.push((i+1).toString())
                                     item.push(rowRet[i].trday)
                                     item.push(rowRet[i].trid)
                                     item.push(rowRet[i].traderid)
                                     item.push(rowRet[i].cid)
                                     item.push(rowRet[i].cname)
                                     item.push(rowRet[i].acid)
                                     item.push(rowRet[i].termorderid)
                                     item.push(rowRet[i].trd_orderid)
                                     item.push(rowRet[i].side)
                                     item.push(rowRet[i].cmdname)
                                     item.push(rowRet[i].ordertm)
                                     item.push(rowRet[i].act_orderid)
                                     item.push(rowRet[i].cancelordertm)
                                     item.push(rowRet[i].cancelvol)
                                     item.push(rowRet[i].price)
                                     item.push(rowRet[i].volume)
                                     item.push(rowRet[i].tradevol)
                                     item.push(rowRet[i].tradeamt)
                                     item.push(rowRet[i].tradeamtaver)
                                     item.push(rowRet[i].overnighttype)
                                     item.push(rowRet[i].overnighttrdvol)
                                     item.push(rowRet[i].overnighttrdamt)
                                     item.push(rowRet[i].taxfee)
                                     item.push(rowRet[i].transfee)
                                     item.push(rowRet[i].commissionfee)
                                     item.push(rowRet[i].otherfee)
                                     item.push(rowRet[i].buyamt)
                                     item.push(rowRet[i].sellamt)
                                     rows.push(item)
                                 }
                                 excel.export(postman, cols, rows)
                             }
                }else{
                    console.log(err)
                }
                });




        }
    });
}
</script>


<script client>
var curTrid = ''
var curPage = 1                 /** 当前页面 */
var orderStat = '00000'         /** 过滤的订单状态 */

export var  events = {
    'trid-changed': function (trid) {
        curTrid = trid
        console.log('------------>', trid)
    },
    'page-changed': function(currentPage) {
        curPage = currentPage
        console.log('I have receive a page_changed singal, current_page = ', currentPage)
        this.updateView()
    }
}

export function data() {
    return {
        "signalDataCells": [],
        "totalDataCell" : {
            "sumtradeamt": 0,
            "sumtaxfee": 0,
            "sumtransfee": 0,
            "sumcommissionfee": 0,
            "sumotherfee": 0,
            "sumbuyamt": 0,
            "sumsellamt": 0,
            "sumclosepl": 0,
            "sumtotalclosepl": 0,
        },
         "currentPage":0,
    }
}
/**
* @desc 获取查询条件
* @author luchenqun
* @returns {Object} conditions  - 查询条件
*/
export function getConditions(){
    var conditions = {}
    if(curTrid === ''){
        conditions.errorMsg = "您需要先选择交易单元"
    }else{
        conditions.trid = curTrid
        conditions.begindate = $(".js-date-begin").val().replace(/-/g, '')
        conditions.enddate = $(".js-date-end").val().replace(/-/g, '')
        conditions.orderstat = orderStat
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
        conditions.keyWord = $(".search-keyword").val()
    }

    return conditions
}

export function updateView() {
    var self = this
    var sendData = getConditions()
    console.log('updateView', sendData)

    if(typeof sendData.errorMsg !== 'undefined'){
        csp.notify('notice', {
            msg: sendData.errorMsg,
        });
        return
    }
    jQuery(".ui.dimmer.tridTradeTab").addClass("active")
    updateData(sendData, function(err, receiveData) {
        var msg = ''
        if(!receiveData.error){
            self.currentPage = curPage
            self.signalDataCells = receiveData.signalDataCells
            self.totalDataCell = receiveData.totalDataCell
            self.$refs.pagination.setPage(parseInt(receiveData.pageCount), curPage)
            msg = '恭喜你，数据查询成功！'
            jQuery(".ui.dimmer.tridTradeTab").removeClass("active")
            csp.fixTableHead("js-trid-trade-table", "100%", "100%")
        } else{
            msg = '查询失败'
            jQuery(".ui.dimmer.tridTradeTab").removeClass("active")
        }
        csp.notify('notice', {
            msg: msg,
            delay: 15000,
        });

    })
}

export function ready() {
    console.log("--------------->TridTradeTable ready")
    jQuery('.ui.dropdown.date').dropdown();

    var self = this
    var maid ='';
    getMaid(function(err,data){
        if(!err){
            maid = data.maid;
            console.log(maid)
             self.$refs.trid_dropdown.updateDropdownList(maid)
        }
    })



    // 查看多天 只查一天
    jQuery('.js-date-condition').dropdown("set value", "multiple-day")        // 设置查看多天为默认选项
    jQuery('.js-date-condition').dropdown({
        on: 'hover',
        onChange: function(value, title, $el) {
            console.log('------------->', value)
            if(value === 'multiple-day'){
                jQuery('.js-date-end').datepicker('enable');
            } else if(value === 'singal-day') {
                jQuery('.js-date-end').datepicker('disable');
                jQuery('.js-date-end').val(jQuery('.js-date-begin').val());
            }
            curPage = 1
        },
    });

    // 订单状态过滤
    jQuery('.js-order-condition').dropdown({
        onChange: function(value, title, $el) {
            console.log('-------------->', value, title)
            value = value.split(",");
            orderStat = ''
            orderStat += jQuery.inArray("has-trade", value) >= 0 ? '1' : '0'
            orderStat += jQuery.inArray("has-all-trade", value) >= 0 ? '1' : '0'
            orderStat += jQuery.inArray("has-cancel", value) >= 0 ? '1' : '0'
            orderStat += jQuery.inArray("has-trade-and-cancel", value) >= 0 ? '1' : '0'
            orderStat += jQuery.inArray("has-over-order", value) >= 0 ? '1' : '0'
            console.log('orderStat-------------->', value, orderStat)
            curPage = 1
        }
    })

    var today = new Date().format("yyyy-MM-dd");
    jQuery('.js-date-begin').val(today);
    jQuery('.js-date-end').val(today);

    jQuery('.js-date-begin').datepicker({
      changeMonth: true,
      changeYear: true,
      onClose:function (dateText,inst){
         date = $(this).datepicker("getDate");
         if(jQuery('.js-date-condition').dropdown("get value") === "singal-day"){
             jQuery('.js-date-end').val(jQuery('.js-date-begin').val());
       }
       console.log(curPage)
       curPage = 1
   }
    });
   jQuery('.js-date-end').datepicker({
      changeMonth: true,
      changeYear: true,
      onClose:function (dateText,inst){
         date = $(this).datepicker("getDate");
         curPage = 1
       }
    });

    jQuery(window).resize(function(){
        csp.fixTableHead("js-trid-trade-table", "100%", "100%")
    });
}
/**
* @desc 导出功能
* @author luchenqun
*/
export function exportExcel(){
    var sendData = getConditions()
    if(typeof sendData.errorMsg !== 'undefined'){
        csp.notify('notice', {
            msg: sendData.errorMsg,
        });
    }else{
        saveExcelFile.downloadFile(sendData)
        csp.notify('notice', {
            msg: '正在导出数据到excel文件，请稍后......',
        });
    }

}


</script>
