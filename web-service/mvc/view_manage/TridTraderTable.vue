<template class="TridTrader">
  <div class="ui medium header">交易单元交易员汇总表(TRD003)</div>
  <div class="data-container">

    <div class="data">

        <p class="title">资产账户交易明细</p>
        <div class="ui above">
          <widget-trader-dropdown v-ref:trader_dropdown></widget-trader-dropdown>
          <div class="ui dropdown date js-date-condition" style="z-index:101">
              <input type="hidden" name="above-date">
              <div class="text">查看多天</div>
              <i class="dropdown icon"></i>
              <div class="menu">
                  <div class="item" data-value="multiple-day">查看多天</div>
                  <div class="item" data-value="singal-day">只查一天</div>
              </div>
          </div>
          <div class="ui icon input" style="margin-right:2px;">
              <input class="js-date-begin" type="text" readonly="readonly">
              <i class="calendar outline icon"></i></div>
          <span>-</span>
          <div class="ui icon input">
              <input class="js-date-end" type="text" readonly="readonly">
              <i class="calendar outline icon"></i>
          </div>
          <div class="ui icon input" style="margin-left:5px; margin-right:16px;">
              <input type="text" class="trader-keyword" placeholder="请输入关键字查询">
              <i class="search icon"></i>
          </div>
          <button class="ui primary button" v-on:click="updateView">查&nbsp;询 </button>
          <button class="ui button" v-on:click="exportExcel">导&nbsp;出 </button>
          <div class="table-container">
              <table id="js-trid-trader-table" class="ui single line selectable striped table">
                  <thead id="fix-header" class="js-head-center">
                      <tr>
                        <th>序号</th>
                        <th>交易日</th>
                        <th>交易员</th>
                        <th>上日多仓隔夜成本</th>
                        <th>上日空仓隔夜成本</th>
                        <th>本日买入总金额</th>
                        <th>本日卖出总金额</th>
                        <th>本日多仓隔夜市值</th>
                        <th>本日空仓隔夜市值</th>
                        <th>总费用</th>
                        <th>平隔夜仓</th>
                        <th>浮动盈亏</th>
                        <th>总盈亏</th>
                        <th>总净盈亏</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in signalDataCells" >
                      <td class="js-head-center">{{$index+1}}</td>
                      <td class="js-head-center">{{item.trday}}</td>
                      <td class="js-head-center">{{item.traderid}}</td>
                      <td class="js-num-right">{{item.prevolamt}}</td>
                      <td class="js-num-right">{{item.preshortamt}}</td>
                      <td class="js-num-right">{{item.buyamt}}</td>
                      <td class="js-num-right">{{item.sellamt}}</td>
                      <td class="js-num-right">{{item.volamt}}</td>
                      <td class="js-num-right">{{item.shortamt}}</td>
                      <td class="js-num-right">{{item.totalfee}}</td>
                      <td class="js-num-right">{{item.overnightpl}}</td>
                      <td class="js-num-right">{{item.floatpl}}</td>
                      <td class="js-num-right">{{item.closepl}}</td>
                      <td class="js-num-right">{{item.totalclosepl}}</td>
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
                      <div class="value">{{totalDataCell.sumtotfeel}}</div>
                      <div class="label">总费用</div>
                  </div>
              </div>
              <div class="item">
                  <div class="ui mini statistic">
                      <div class="value">{{totalDataCell.sumclospl}}</div>
                      <div class="label">总盈亏</div>
                  </div>
              </div>
              <div class="item">
                  <div class="ui mini statistic">
                      <div class="value">{{totalDataCell.sumtotclosepl}}</div>
                      <div class="label">总净盈亏</div>
                  </div>
              </div>
            </div>
        </div>
    </div>
    <div class="ui  dimmer tridTraderTab">
        <div class="ui text loader">正在查询……</div>
    </div>
  </div>
</template>

<style>
.TridTrader{
    height: 100%;
    width: 100%;
    padding-top:12px;
}
.ui.divided.list .item{
    width: 33.1%;
    text-align: center;
 }
 .table-container{
  margin-top: 10px;
 }
  .js-head-center {
      text-align: center;
  }
  .js-num-right {
      text-align: right;
  }
 </style>

<script server>


export function updateData(postman, reqData) {
    var ret = {
        "error": false,
        "signalDataCells": [],
        "totalDataCell": {},
        "pageCount": 0,
    };
    var querySql = "";
    querySql = "CALL pr_trd003('" + reqData.traderid + "', '" + reqData.trid + "', '" + reqData.begindate + "', '"
                     + (reqData.enddate ? reqData.enddate : reqData.begindate) + "')";
    ison.db.query(querySql, function(err,data){
        if(!err){
            var rowRet = data[0];
            if(typeof reqData.page === 'undefined'  || typeof reqData.pageCount === 'undefined' ){
                ret.error = true;
            } else {
                    formatData(rowRet);

                    for (var i = 0; i < rowRet.length; i++) {
                        rowRet[i].totalclosepl = parseFloat(rowRet[i].closepl - rowRet[i].totalfee).toFixed(2);
                    }
                    var retData = filterSelData(rowRet, reqData.page, reqData.pageCount, reqData.keyWord);
                    ret.signalDataCells = retData.detail_data;
                    ret.totalDataCell = retData.total_data;
                    ret.pageCount = retData.pages;
        
            }
            postman(ret);
        }else{
            ret.error = true;
            console.log("err--->", err);
            postman([])
        }
    })
}

export function filterSelData(orgData, page, pageCount, keyWord){
    var filterData= [] ;    // 过滤后的数据
    if(typeof keyWord === 'undefined' || keyWord === ''){
        filterData = orgData
    } else{
        console.log('orgData length = ', orgData.length)
        for(var i=0; i<orgData.length; i++){
            if(orderKeyFilter(orgData[i], keyWord)){
                filterData.push(orgData[i])
            }
        }
        console.log('filterData length = ', filterData.length)
    }

    var retData = {};
    retData.total_data = totalDataCalc(filterData);                             // 统计数据
    retData.pages = Math.ceil(parseFloat(filterData.length/pageCount))  // 总页码
    retData.detail_data = pageDataGet(filterData, page, pageCount);     // 过滤数据

    return retData;
}

function orderKeyFilter(order, keyWord){
    return (order.trday.toString().match(keyWord)
        || order.traderid.toString().match(keyWord)
        || order.prevolamt.toString().match(keyWord)
        || order.preshortamt.toString().match(keyWord)
        || order.buyamt.toString().match(keyWord)
        || order.sellamt.toString().match(keyWord)
        || order.volamt.toString().match(keyWord)
        || order.shortamt.toString().match(keyWord)
        || order.overnightpl.toString().match(keyWord)
        || order.floatpl.toString().match(keyWord)
        || order.totalfee.toString().match(keyWord)
        || order.closepl.toString().match(keyWord));
}


export function formatData(data){
    for(var i=0; i<data.length; i++){
        data[i].trday = isNaN(data[i].trday) ? "" : data[i].trday;
        data[i].prevolamt = isNaN(data[i].prevolamt) ? "0.00" : parseFloat(data[i].prevolamt).toFixed(2);
        data[i].preshortamt = isNaN(data[i].preshortamt) ? "0.00" : parseFloat(data[i].preshortamt).toFixed(2);
        data[i].buyamt = isNaN(data[i].buyamt) ? "0.00" : parseFloat(data[i].buyamt).toFixed(2);
        data[i].sellamt = isNaN(data[i].sellamt) ? "0.00" : parseFloat(data[i].sellamt).toFixed(2);
        data[i].volamt = isNaN(data[i].volamt) ? "0.00" : parseFloat(data[i].volamt).toFixed(2);
        data[i].shortamt = isNaN(data[i].shortamt) ? "0.00" : parseFloat(data[i].shortamt).toFixed(2);
        data[i].overnightpl = isNaN(data[i].overnightpl) ? "0.00" : parseFloat(data[i].overnightpl).toFixed(2);
        data[i].floatpl = isNaN(data[i].floatpl) ? "0.00" : parseFloat(data[i].floatpl).toFixed(2);
        data[i].totalfee = isNaN(data[i].totalfee) ? "0.00" : parseFloat(data[i].totalfee).toFixed(2);
        data[i].closepl = isNaN(data[i].closepl) ? "0.00" : parseFloat(data[i].closepl).toFixed(2);
        data[i].totalclosepl = parseFloat(data[i].closepl - data[i].totalfee).toFixed(2);   // 净盈亏 = 盈亏 - 总手续费
    }
}
/**
* @desc 计算总计数据
* @author wangxiong
* @param {Array} selData   - 查询出来的所有订单数据
*/
export function totalDataCalc(selData){
    //初始化总计数据
    var totalDataCell = {};
    totalDataCell.sumtotfeel = parseFloat(0.00);
    totalDataCell.sumclospl = parseFloat(0.00);
    totalDataCell.sumtotclosepl = parseFloat(0.00);

    for(var i=0;i<selData.length;i++){
        totalDataCell.sumtotfeel += (!isNaN(selData[i].totalfee) ? parseFloat(selData[i].totalfee) : 0)
        totalDataCell.sumclospl   +=  (!isNaN(selData[i].closepl) ? parseFloat(selData[i].closepl) : 0)
        totalDataCell.sumtotclosepl +=  (!isNaN(selData[i].totalclosepl) ? parseFloat(selData[i].totalclosepl) : 0)
    }

    for(var obj in totalDataCell){
        totalDataCell[obj] = parseFloat(totalDataCell[obj]).toFixed(2);
    }
    return totalDataCell;
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
* @desc 导出数据
* @author luchenqun lizhexi
* @param {Object} postman   - 推送的数据对象
* @param {Object} inPutParm - 输入的数据(即查询条件)
*/
export function saveExcelFile(postman, inPutParm){
    var querySql = "";
    querySql = "CALL pr_trd003('" + inPutParm.traderid + "', '" + inPutParm.trid + "', '" + inPutParm.begindate + "', '"
                     + (inPutParm.enddate ? inPutParm.enddate : inPutParm.begindate) + "')";


    ison.db.query(querySql, function(err,data) {
        if(!err){
             var rowRet =data[0];
            if(typeof inPutParm.page !== 'undefined'  && typeof inPutParm.pageCount !== 'undefined' ){


                if (rowRet.length > 0) {
                     formatData(rowRet);
                    for (var i = 0; i < rowRet.length; i++) {
                        rowRet[i].totalclosepl = parseFloat(rowRet[i].closepl - rowRet[i].totalfee).toFixed(2);
                    }
                    var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
                    var totalDataCell = retData.total_data;

                    var cols = []
                    var rows = []

                    var titles = [
                        "序号","交易日","交易员","上日多仓隔夜成本","上日空仓隔夜成本","本日买入总金额",
                        "本日卖出总金额","本日多仓隔夜市值","本日空仓隔夜市值","总费用","平隔夜仓",
                        "浮动盈亏","总盈亏","总净盈亏",
                    ]
                   var totalTitles = [
                       "总费用","总盈亏","总净盈亏",
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
                     item[0]="交易单元交易员汇总表(TRD003)"
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
                     totalDataItem.push(totalDataCell.sumtotfeel);
                     totalDataItem.push(totalDataCell.sumclospl);
                     totalDataItem.push(totalDataCell.sumtotclosepl);
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
                         item.push(rowRet[i].traderid)
                         item.push(rowRet[i].prevolamt)
                         item.push(rowRet[i].preshortamt)
                         item.push(rowRet[i].buyamt)
                         item.push(rowRet[i].sellamt)
                         item.push(rowRet[i].volamt)
                         item.push(rowRet[i].shortamt)
                         item.push(rowRet[i].totalfee)
                         item.push(rowRet[i].overnightpl)
                         item.push(rowRet[i].floatpl)
                         item.push(rowRet[i].closepl)
                         item.push(rowRet[i].totalclosepl)
                         rows.push(item)
                       }
                        excel.export(postman, cols, rows)
            }



            }
        }else{
            console.log("err--->", err);
        }

    });
}
</script>


<script>

var curTrid = '';
var curTraderid = '';
var curPage = 1;                /** 当前页面 */


export var  events = {
    'trader-changed': function (traderid, trid) {
        curTraderid = traderid
        curTrid = trid
        console.log('curTraderid------------>', curTraderid, 'curTrid: ', trid)
    },
    'page-changed': function(currentPage) {
        curPage = currentPage
        console.log('I have receive a page_changed singal, current_page = ', currentPage)
        this.updateView()
    },
}

export function data() {
    return {
        "signalDataCells": [],
        "totalDataCell" : {
            "sumtotfeel": 0,
            "sumclospl": 0,
            "sumtotclosepl": 0,
        }
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
        if(curTraderid === ''){
            conditions.errorMsg = "您需要先选择交易员"
        }else{
        conditions.trid = curTrid
        conditions.traderid = curTraderid
        conditions.begindate = $(".js-date-begin").val().replace(/-/g, '')
        conditions.enddate = $(".js-date-end").val().replace(/-/g, '')
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
        conditions.keyWord = $(".trader-keyword").val()
    }
    }

    return conditions
}
export function updateView() {
    var self = this;
    var sendData = getConditions()
    if(typeof sendData.errorMsg !== 'undefined'){
        csp.notify('notice', {
            msg: sendData.errorMsg,
        });
        return
    }
    jQuery(".ui.dimmer.tridTraderTab").addClass("active")
    updateData(sendData, function(err, receiveData) {
        var msg = ''
        if (!receiveData.error) {
            self.currentPage = curPage
            self.signalDataCells = receiveData.signalDataCells;
            self.totalDataCell = receiveData.totalDataCell;
            self.$refs.pagination.setPage(parseInt(receiveData.pageCount), curPage);
            msg = '恭喜你，数据查询成功！'
            jQuery(".ui.dimmer.tridTraderTab").removeClass("active")
            csp.fixTableHead("js-trid-trader-table", "100%", "100%")
        }else{
            msg = '查询失败'
            jQuery(".ui.dimmer.tridTraderTab").removeClass("active")
        }
        csp.notify('notice', {
            msg: msg,
            delay: 15000,
        });
    })
}

export function ready() {
    console.log("--------------->TridTraderTable ready")
    var self = this
    var maid ='';
    getMaid(function(err,data){
        if(!err){
            maid = data.maid;
             self.$refs.trader_dropdown.updateDropdownList(maid);
        }
    })
 // 查看多天 只查一天
 jQuery('.js-date-condition').dropdown("set value", "multiple-day")        // 设置查看多天为默认选项
 jQuery('.js-date-condition').dropdown({
     on: 'hover',
     onChange: function(value, title, $el) {
         if(value === 'multiple-day'){
             jQuery('.js-date-end').datepicker('enable');
         } else if(value === 'singal-day') {
             jQuery('.js-date-end').datepicker('disable');
             jQuery('.js-date-end').val(jQuery('.js-date-begin').val());
         }
     },
 });

 var today = new Date().format("yyyy-MM-dd");
 jQuery('.js-date-begin').val(today);
 jQuery('.js-date-end').val(today);

 jQuery('.js-date-begin').datepicker({
     changeMonth: true,
     changeYear: true,
     onClose: function(dateText, inst) {
         date = $(this).datepicker("getDate");
         if(jQuery('.js-date-condition').dropdown("get value") === "singal-day"){
             jQuery('.js-date-end').val(jQuery('.js-date-begin').val());
         }
         curPage = 1;
     }
 });

 jQuery('.js-date-end').datepicker({
     changeMonth: true,
     changeYear: true,
     onClose: function(dateText, inst) {
         date = $(this).datepicker("getDate");
         curPage = 1;
     }
 });





jQuery(window).resize(function(){
    csp.fixTableHead("js-trid-trader-table", "100%", "100%")
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
