<template class="TridHistory">
    <div class="ui header">
        <h3 style="float:left">交易单元历史结算表(TRD005)</h3>

    </div>

    <div class="data-container">
        <div class="data">
            <p class="title">交易单元历史结算明细</p>
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

                <button class="ui primary button" v-on:click="updateView">查&nbsp;询 </button>
                <button class="ui button" v-on:click="exportExcel">导&nbsp;出 </button>

                <div class="table-container">
                    <table id="js-trid-history-table" class="ui single line selectable striped table">
                        <thead id="fix-header">
                            <tr>
                            <th style="text-align:center">序号</th>
                            <th style="text-align:center">交易日</th>
                            <th style="text-align:center">券源市值</th>
                            <th style="text-align:center">已用券源市值</th>
                            <th style="text-align:center">券源使用率(%)</th>
                            <th style="text-align:center">本日多仓成本</th>
                            <th style="text-align:center">本日空仓成本</th>
                            <th style="text-align:center">上日多仓成本</th>
                            <th style="text-align:center">上日空仓成本</th>
                            <th style="text-align:center">买入发生金额</th>
                            <th style="text-align:center">卖出发生金额</th>
                            <th style="text-align:center">成交金额</th>
                            <th style="text-align:center">本日手续费</th>
                            <th style="text-align:center">本日券息</th>
                            <th style="text-align:center">本日盈亏</th>
                            <th style="text-align:center">本日净盈亏</th>
                            <th style="text-align:center">盈利比率</th>
                            <th style="text-align:center">应付系统使用费</th>
                            <th style="text-align:center">平隔夜仓盈亏</th>
                            <th style="text-align:center">浮动盈亏</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in signalDataCells" >
                          <td>{{$index + 1 + (currentPage-1) * 15}</td>
                          <td>{{item.trday}}</td>
                          <td class="right aligned">{{item.sa_value}}</td>
                          <td class="right aligned">{{item.used_savalue}}</td>
                          <td class="right aligned">{{item.usedsa_rate}}</td>
                          <td class="right aligned">{{item.long_value}}</td>
                          <td class="right aligned">{{item.short_value}}</td>
                          <td class="right aligned">{{item.prelong_value}}</td>
                          <td class="right aligned">{{item.preshort_value}}</td>
                          <td class="right aligned">{{item.buyamt}}</td>
                          <td class="right aligned">{{item.sellamt}}</td>
                          <td class="right aligned">{{item.tradeamt}}</td>
                          <td class="right aligned">{{item.totalfee}}</td>
                          <td class="right aligned">{{item.safee}}</td>
                          <td class="right aligned">{{item.profit}}</td>
                          <td class="right aligned">{{item.profit_net}}</td>
                          <td class="right aligned">{{item.profit_rate}}</td>
                          <td class="right aligned">{{item.systemfee}}</td>
                          <td class="right aligned">{{item.overnightpl}}</td>
                          <td class="right aligned">{{item.floatpl}}</td>
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
                            <div class="value">{{totalDataCell.sumtotalfee}}</div>
                            <div class="label">总手续费</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sumsafee}}</div>
                            <div class="label">总券息</div>
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
            <div class="ui  dimmer tridHistoryTab">
                <div class="ui text loader">正在查询……</div>
            </div>
        </div>

    </div>
</template>

<style>
.TridHistory{
    height: 100%;
    width: 100%;
    padding-top:12px;
}
.ui.divided.list .item{
        width: 13.8%;
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
    var sql = ""
    var sqlWhere = " where 1=1 ";
    var querySql = "";
    var checkToday = new Date().format("yyyyMMdd").toString();
//如果查询当日数据,则先判断该资产单元是否已经结算完成
    if(inPutParm.begindate == inPutParm.enddate && inPutParm.begindate == checkToday){
            var caid = inPutParm.trid.split(".")[0]+"."+inPutParm.trid.split(".")[1];
            //clearstat=99 表示结算成功
            sql = " select caid,clearstat from tacap_clearlog where trday='"+inPutParm.begindate+"' AND caid='"+caid+"' AND clearstat='99'";

            console.log("SelTrd005Report-->sel tacap clearstat sql: "+sql);
            ison.db.query(sql,function(err,data){
                if(err){
                    ret.error = true;
                    console.log(err)
                    postman(ret)
                    return
                }else{
                    if(data[0].length <=0){
                        ret.error = true;
                        console.log("该报表当天数据，只有收盘后，所属资产单元结算成功才能查询")
                        postman(ret)
                        return
                    }
                }
            });
    }


      querySql = "CALL pr_trd005('"+inPutParm.trid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"')";
     console.log("Trd005------>sql:"+querySql);
    ison.db.query(querySql, function(err, data){
        if(err){
            ret.error = true
            postman(ret)
        }else{
            var commit = data[0];
            if(commit[0].v_error == 0){ //0:成功，1:业务问题异常  2:数据库执行异常
              console.log("生成数据成功")
              sqlWhere +=" AND t5.trday>='"+inPutParm.begindate+"' AND t5.trday<='"+inPutParm.enddate+"' AND t5.trid ='"+inPutParm.trid+"' ";
              sql = "select t5.trday,t5.trid,t5.sa_value ,t5.used_savalue,t5.prelong_value,t5.preshort_value,t5.long_value,t5.short_value,t5.buyamt,t5.sellamt,t5.totalfee, "+
                    " t5.safee,t5.profit,t5.profit_net,t5.systemfee,t5.usedsa_rate,t5.profit_rate ,t5.tradeamt,t5.overnightpl,t5.floatpl from tr_trd005 t5 ";

              sql += sqlWhere;
              sql += " order by t5.trday ,t5.trid ";
              console.log("SelTrd005Report-->sql: "+sql);
              ison.db.query(sql,function(err,rows,fields){
                 if(err){
                     ret.error = true
                 }else{
                     var rowRet= rows;
                     formatData(rowRet);
                     ret.signalDataCells = pageDataGet(rowRet, inPutParm.page, inPutParm.pageCount);         // 明细数据
                     ret.totalDataCell = totalDataCalc(rowRet);                                              // 总数据
                     ret.pageCount = Math.ceil(parseFloat(rowRet.length / inPutParm.pageCount))              // 总页码
                 }
                     postman(ret)
              });

            }else{
                ret.error = true ;
                postman(ret)
            }


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
* @desc 格式化数据
* @author lizhexi lubaolin
* @param {Array} data   - 查询出来的所有订单数据
*/
function formatData(data){
    for(var i=0; i<data.length; i++){
        data[i].sa_value = notNum(data[i].sa_value)?"0.00":parseFloat(data[i].sa_value).toFixed(2);
        data[i].used_savalue = notNum(data[i].used_savalue)?"0.00":parseFloat(data[i].used_savalue).toFixed(2);
        data[i].usedsa_rate = notNum(data[i].usedsa_rate)?"0.00":parseFloat(data[i].usedsa_rate).toFixed(2);
        data[i].long_value = notNum(data[i].long_value)?"0.00":parseFloat(data[i].long_value).toFixed(2);
        data[i].short_value = notNum(data[i].short_value)?"0.00":parseFloat(data[i].short_value).toFixed(2);
        data[i].prelong_value = notNum(data[i].prelong_value)?"0.00":parseFloat(data[i].prelong_value).toFixed(2);
        data[i].preshort_value = notNum(data[i].preshort_value)?"0.00":parseFloat(data[i].preshort_value).toFixed(2);
        data[i].buyamt = notNum(data[i].buyamt)?"0.00":parseFloat(data[i].buyamt).toFixed(2);
        data[i].sellamt = notNum(data[i].sellamt)?"0.00":parseFloat(data[i].sellamt).toFixed(2);
        data[i].tradeamt = notNum(data[i].tradeamt)?"0.00":parseFloat(data[i].tradeamt).toFixed(2);
        data[i].totalfee = notNum(data[i].totalfee)?"0.00":parseFloat(data[i].totalfee).toFixed(2);
        data[i].safee = notNum(data[i].safee)?"0.00":parseFloat(data[i].safee).toFixed(2);
        data[i].profit = notNum(data[i].profit)?"0.00":parseFloat(data[i].profit).toFixed(2);
        data[i].profit_net = notNum(data[i].profit_net)?"0.00":parseFloat(data[i].profit_net).toFixed(2);
        data[i].profit_rate = notNum(data[i].profit_rate)?"0.00":parseFloat(data[i].profit_rate).toFixed(6);
        //data[i].profit_rate = parseFloat(data[i].profit_rate*10000).toFixed(2);//万分号表示
        data[i].systemfee = notNum(data[i].systemfee)?"0.00":parseFloat(data[i].systemfee).toFixed(2);
        data[i].overnightpl = notNum(data[i].overnightpl)?"0.00":parseFloat(data[i].overnightpl).toFixed(2);
        data[i].floatpl = notNum(data[i].floatpl)?"0.00":parseFloat(data[i].floatpl).toFixed(2);
    }
}
/**
* @desc 数据过滤
* @author lizhexi lubaolin
* @param {Array} selData 查询得到的数据
*/
function totalDataCalc(selData)
{
    var total_dataCell={};//总计数据模型初始化
    total_dataCell.sumtradeamt=parseFloat(0.00);
    total_dataCell.sumbuyamt=parseFloat(0.00);
    total_dataCell.sumsellamt=parseFloat(0.00);
    total_dataCell.sumtotalfee=parseFloat(0.00);
    total_dataCell.sumsafee=parseFloat(0.00);
    total_dataCell.sumclosepl = parseFloat(0.00);
    total_dataCell.sumtotalclosepl = parseFloat(0.00);


   for(var i=0;i<selData.length;i++){
       //合计数据
       total_dataCell.sumtradeamt +=  parseFloat(selData[i].tradeamt);
       total_dataCell.sumbuyamt +=  parseFloat(selData[i].buyamt);
       total_dataCell.sumsellamt +=  parseFloat(selData[i].sellamt);
       total_dataCell.sumtotalfee +=  parseFloat(selData[i].totalfee);
       total_dataCell.sumsafee +=  parseFloat(selData[i].safee);
       total_dataCell.sumclosepl +=  parseFloat(selData[i].profit);
       total_dataCell.sumtotalclosepl +=  parseFloat(selData[i].profit_net);
   }


        //加载合计数据模型
        var tmpTotal_dataCell ={};

        tmpTotal_dataCell.sumtradeamt = isNaN(parseFloat(total_dataCell.sumtradeamt).toFixed(2))?'0.00':parseFloat(total_dataCell.sumtradeamt).toFixed(2);
        tmpTotal_dataCell.sumbuyamt = isNaN(parseFloat(total_dataCell.sumbuyamt).toFixed(2))?'0.00':parseFloat(total_dataCell.sumbuyamt).toFixed(2);
        tmpTotal_dataCell.sumsellamt= isNaN(parseFloat(total_dataCell.sumsellamt).toFixed(2))?'0.00':parseFloat(total_dataCell.sumsellamt).toFixed(2);
        tmpTotal_dataCell.sumtotalfee= isNaN(parseFloat(total_dataCell.sumtotalfee).toFixed(2))?'0.00':parseFloat(total_dataCell.sumtotalfee).toFixed(2);
        tmpTotal_dataCell.sumsafee= isNaN(parseFloat(total_dataCell.sumsafee).toFixed(2))?'0.00':parseFloat(total_dataCell.sumsafee).toFixed(2);
        tmpTotal_dataCell.sumclosepl= isNaN(parseFloat(total_dataCell.sumclosepl).toFixed(2))?'0.00':parseFloat(total_dataCell.sumclosepl).toFixed(2);
        tmpTotal_dataCell.sumtotalclosepl= isNaN(parseFloat(total_dataCell.sumtotalclosepl).toFixed(2))?'0.00':parseFloat(total_dataCell.sumtotalclosepl).toFixed(2);

        return tmpTotal_dataCell;

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
    console.log("allData.slice: ", currentStartCount, currentStartCount+pageCount);
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
    var sqlWhere = "where 1=1";
    var querySql = "";
    var checkToday = new Date().format("yyyyMMdd").toString();
//如果查询当日数据,则先判断该资产单元是否已经结算完成
    if(inPutParm.begindate == inPutParm.enddate && inPutParm.begindate == checkToday){
            var caid = inPutParm.trid.split(".")[0]+"."+inPutParm.trid.split(".")[1];
            //clearstat=99 表示结算成功
            sql = " select caid,clearstat from tacap_clearlog where trday='"+inPutParm.begindate+"' AND caid='"+caid+"' AND clearstat='99'";

            ison.db.query(sql,function(err,data){
                if(!err){
                    if(data[0].length <= 0){
                        console.log("该报表当天数据，只有收盘后，所属资产单元结算成功才能查询")
                        return
                    }
                }else{
                    return
                }
            });
    }
    querySql = "CALL pr_trd005('"+inPutParm.trid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"')";
   console.log("Trd005------>sql:"+querySql);
  ison.db.query(querySql, function(err, data){
      if(!err){
          var commit = data[0];
          if(commit[0].v_error == 0){ //0:成功，1:业务问题异常  2:数据库执行异常

    sqlWhere +=" AND t5.trday>='"+inPutParm.begindate+"' AND t5.trday<='"+inPutParm.enddate+"' AND t5.trid ='"+inPutParm.trid+"' ";
    sql = "select t5.trday,t5.trid,t5.sa_value ,t5.used_savalue,t5.prelong_value,t5.preshort_value,t5.long_value,t5.short_value,t5.buyamt,t5.sellamt,t5.totalfee, "+
          " t5.safee,t5.profit,t5.profit_net,t5.systemfee,t5.usedsa_rate,t5.profit_rate ,t5.tradeamt,t5.overnightpl,t5.floatpl from tr_trd005 t5 ";

    sql += sqlWhere;
    sql += " order by t5.trday ,t5.trid ";

    ison.db.query(sql, function(err, rows, fields) {
        if(!err){
   //获取处理数据
            var rowRet = rows
            formatData(rowRet)
            var totalDataCell = totalDataCalc(rowRet);
            var cols = []
            var rows = []
     //写入表格
            var titles = [
                "序号","交易日","券源市值","已用券源市值","券源使用率(%)",
                "本日多仓成本","本日空仓成本","上日多仓成本","上日空仓成本","买入发生金额",
                "卖出发生金额","成交金额","本日手续费","本日券息","本日盈亏",
                "本日净盈亏","盈利比率","应付系统使用费","平隔夜仓盈亏","浮动盈亏",
            ]
            var totalTitles = [
                "成交总金额","买入发生金额","卖出发生金额",
                "总手续费","总券息","总盈亏","总净盈亏",
            ]

            //规定列数和类别
            for(var i=0; i<titles.length; i++){
                var item = {}
                item.caption =''
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
            item[0]="交易单元历史结算表(TRD005)"
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
            totalDataItem.push(totalDataCell.sumbuyamt);
            totalDataItem.push(totalDataCell.sumsellamt);
            totalDataItem.push(totalDataCell.sumtotalfee);
            totalDataItem.push(totalDataCell.sumsafee);
            totalDataItem.push(totalDataCell.sumclosepl);
            totalDataItem.push(totalDataCell.sumtotalclosepl);
            for(var i=totalTitles.length;i<titles.length;i++){
                totalDataItem.push('')
            }
            rows.push(totalDataItem)
            rows.push(blankRow)

            //交易单元历史结算数据
            var titleItem =[]
            for(var i=0;i<titles.length;i++){
                titleItem.push(titles[i])
            }
            rows.push(titleItem);
            for(var i=0; i<rowRet.length; i++){
                var item = []
                item.push((i+1).toString())
                item.push(rowRet[i].trday)
                item.push(rowRet[i].sa_value)
                item.push(rowRet[i].used_savalue)
                item.push(rowRet[i].usedsa_rate)
                item.push(rowRet[i].long_value)
                item.push(rowRet[i].short_value)
                item.push(rowRet[i].prelong_value)
                item.push(rowRet[i].preshort_value)
                item.push(rowRet[i].buyamt)
                item.push(rowRet[i].sellamt)
                item.push(rowRet[i].tradeamt)
                item.push(rowRet[i].totalfee)
                item.push(rowRet[i].safee)
                item.push(rowRet[i].profit)
                item.push(rowRet[i].profit_net)
                item.push(rowRet[i].profit_rate)
                item.push(rowRet[i].systemfee)
                item.push(rowRet[i].overnightpl)
                item.push(rowRet[i].floatpl)

                rows.push(item)
            }


            excel.export(postman, cols, rows)
        }
    });
                            }else{
                            console.log("生成数据失败")

                        }


                }
            });
}
</script>


<script client>
var curTrid = ''
var curPage = 1                 /** 当前页面 */

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
            "sumtotalfee": 0,
            "sumbuyamt": 0,
            "sumsellamt": 0,
            "sumsafee":0,
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
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
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
    jQuery(".ui.dimmer.tridHistoryTab").addClass("active")
    updateData(sendData, function(err, receiveData) {
        var msg = ''
        if(!receiveData.error){
            self.currentPage = curPage
            self.signalDataCells = receiveData.signalDataCells
            self.totalDataCell = receiveData.totalDataCell
            self.$refs.pagination.setPage(parseInt(receiveData.pageCount), curPage)
            msg = '恭喜你，数据查询成功！'
            jQuery(".ui.dimmer.tridHistoryTab").removeClass("active")
            csp.fixTableHead("js-trid-history-table", "100%", "100%")
        } else{
            msg = '查询失败'
            jQuery(".ui.dimmer.tridHistoryTab").removeClass("active")
        }
        csp.notify('notice', {
            msg: msg,
            delay: 15000,
        });
        console.log(JSON.stringify(receiveData))
    })
}

export function ready() {
    console.log("--------------->TridHistoryTable ready")
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
        csp.fixTableHead("js-trid-history-table", "100%", "100%")
    });
}
/**
* @desc 导出数据为excel文件
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
