<template class="TridStock">
  <div class="ui medium header">交易单元股票汇总表(TRD002)</div>
  <div class="data-container">
    <div class="data ">

      <p class="title">交易单元股票汇总</p>
      <div class="ui above">
        <widget-trid-dropdown v-ref:trid_dropdown></widget-trid-dropdown>
        &nbsp;&nbsp;
        <span>查询日期</span>
        <div class="ui icon input">
            <input class="js-date" type="text" readonly="readonly">
            <i class="calendar outline icon"></i>
        </div>
        &nbsp;&nbsp;
        <div class="ui icon input" style="margin-left:5px; margin-right:16px;">
            <input class="stock-keyword" type="text" placeholder="请输入关键字查询">
            <i class="search icon"></i>
        </div>
        <button class="ui primary button" v-on:click="updateView">查&nbsp;询 </button>
        <button class="ui button" v-on:click="exportExcel">导&nbsp;出 </button>
        <div class="table-container">
            <table id="js-trid-stock-table" class="ui single line selectable striped table">
              <thead id="fix-header">
                <tr>
                    <th style="text-align:center">序号</th>
                    <th style="text-align:center">交易日</th>
                    <th style="text-align:center">证券代码</th>
                    <th style="text-align:center">证券名称</th>
                    <th style="text-align:center">上日多仓量</th>
                    <th style="text-align:center">上日多仓成本</th>
                    <th style="text-align:center">上日空仓量</th>
                    <th style="text-align:center">上日空仓成本</th>
                    <th style="text-align:center">本日买入数量</th>
                    <th style="text-align:center">本日买入金额</th>
                    <th style="text-align:center">本日卖出数量</th>
                    <th style="text-align:center">本日卖出金额</th>
                    <th style="text-align:center">本日结算价</th>
                    <th style="text-align:center">本日多仓数量</th>
                    <th style="text-align:center">本日多仓成本价</th>
                    <th style="text-align:center">本日空仓数量</th>
                    <th style="text-align:center">本日空仓成本价</th>
                    <th style="text-align:center">本日费用</th>
                    <th style="text-align:center">平隔夜仓盈亏</th>
                    <th style="text-align:center">浮动盈亏</th>
                    <th style="text-align:center">本日盈亏</th>
                    <th style="text-align:center">本日净盈亏</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in signalDataCells" >
                    <td>{{$index + 1 + (currentPage-1) * 15}}</td>
                    <td>{{item.trday}}</td>
                    <td>{{item.cid}}</td>
                    <td>{{item.cname}}</td>
                    <td style="text-align:right">{{item.prevol}}</td>
                    <td style="text-align:right">{{item.prevolprc}}</td>
                    <td style="text-align:right">{{item.preshortvol}}</td>
                    <td style="text-align:right">{{item.preshortvolprc}}</td>
                    <td style="text-align:right">{{item.buytradevol}}</td>
                    <td style="text-align:right">{{item.buytradeamt}}</td>
                    <td style="text-align:right">{{item.selltradevol}}</td>
                    <td style="text-align:right">{{item.selltradeamt}}</td>
                    <td style="text-align:right">{{item.price}}</td>
                    <td style="text-align:right">{{item.vol}}</td>
                    <td style="text-align:right">{{item.volprc}}</td>
                    <td style="text-align:right">{{item.shortvol}}</td>
                    <td style="text-align:right">{{item.shortvolprc}}</td>
                    <td style="text-align:right">{{item.totalfee}}</td>
                    <td style="text-align:right">{{item.overnightpl}}</td>
                    <td style="text-align:right">{{item.floatamt}}</td>
                    <td style="text-align:right">{{item.closepl}}</td>
                    <td style="text-align:right">{{item.totalclosepl}}</td>
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
                  <div class="value">{{ totalDataCell.sumprevol }}</div>
                  <div class="label">上日总多仓量</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumshortprevol }}</div>
                  <div class="label">上日总空仓量</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumbuytradevol }} </div>
                  <div class="label">本日总买入量</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumbuytradeamt }} </div>
                  <div class="label">本日总买金额</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumselltradevol }}</div>
                  <div class="label">本日总卖量</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumselltradeamt }}</div>
                  <div class="label">本日总卖金额</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumclosepl }}</div>
                  <div class="label">本日总盈亏</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumtotalfee}}</div>
                  <div class="label">本日总费用</div>
              </div>
          </div>
          <div class="item">
              <div class="ui mini statistic">
                  <div class="value">{{ totalDataCell.sumtotalclosepl}}</div>
                  <div class="label">本日总净盈亏</div>
              </div>
          </div>
        </div>
      </div>
      <div class="ui  dimmer tridStock">
          <div class="ui text loader">正在查询……</div>
      </div>
    </div>

  </div>
</template>

<style type="text/css">
    .TridStock{
        height: 100%;
        width: 100%;
        padding-top:12px;
    }

    .ui.divided.list .item{
        width: 10.8%;
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
export function updateData(postman, inPutParm) {
    var ret = {
        "error": false,
        "signalDataCells": [],
        "totalDataCell": {},
        "pageCount": 0,
    };
    var querySql = "";


    querySql = "CALL pr_trd002('" + inPutParm.trid + "', '" + inPutParm.begindate + "', '" + (inPutParm.enddate ?inPutParm.enddate : inPutParm.begindate)  + "')";

    console.log("Trd002-->sql: " + querySql);

    ison.db.query(querySql, function(err, rows, fields){
        if(err){
            ret.error = true
            postman(ret)
        }else{
            var rowRet = rows[0]
            if(typeof inPutParm.page === 'undefined'  || typeof inPutParm.pageCount === 'undefined' ){
                ret.error = true
            }else{
                formatData(rowRet)
                var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
                ret.signalDataCells = retData.detail_data
                ret.totalDataCell = retData.total_data
                ret.pageCount = retData.pages

            }
            postman(ret)
        }

     })
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
* @author lizhexi
* @param {Array} data   - 查询出来的所有订单数据
*/
function formatData(data){
    for(var i=0; i<data.length; i++){
        data[i].cid = data[i].cid.substr(0,6);
        data[i].prevol = notNum(data[i].prevol) ? "0" : parseInt(data[i].prevol).toString();
        data[i].prevolprc = notNum(data[i].prevolprc ) ? "0.00" : parseFloat(data[i].prevolprc ).toFixed(2);
        data[i].preshortvol = notNum(data[i].preshortvol) ? "0" : parseInt(data[i].preshortvol).toString();
        data[i].preshortvolprc = notNum(data[i].preshortvolprc) ? "0.000" : parseFloat(data[i].preshortvolprc).toFixed(3);
        data[i].buytradevol = notNum(data[i].buyvol) ? "0" : parseInt(data[i].buyvol).toString();
        data[i].buytradeamt = notNum(data[i].buyamt) ? "0.00" : parseFloat(data[i].buyamt).toFixed(2);
        data[i].selltradevol = notNum(data[i].sellvol) ? "0" : parseInt(data[i].sellvol).toString();
        data[i].selltradeamt = notNum(data[i].sellamt) ? "0.00" : parseFloat(data[i].sellamt).toFixed(2);
        data[i].price = notNum(data[i].price) ? "0.00" : parseFloat(data[i].price).toFixed(2);
        data[i].vol = notNum(data[i].vol) ? "0" : parseInt(data[i].vol).toString();
        data[i].volprc = notNum(data[i].volprc) ? "0.00" : parseFloat(data[i].volprc).toFixed(3);
        data[i].shortvol = notNum(data[i].shortvol) ? "0" : parseInt(data[i].shortvol).toString();
        data[i].shortvolprc = notNum(data[i].shortvolprc) ? "0.00" : parseFloat(data[i].shortvolprc).toFixed(3);
        data[i].overnightpl = notNum(data[i].overnightpl) ? "0.00" : parseFloat(data[i].overnightpl).toFixed(2);
        data[i].floatamt = notNum(data[i].floatamt) ? "0.00" : parseFloat(data[i].floatamt).toFixed(2);
        data[i].totalfee = notNum(data[i].totalfee) ? "0.00" : parseFloat(data[i].totalfee).toFixed(2);
        data[i].closepl = notNum(data[i].closepl) ? "0.00" : parseFloat(data[i].closepl).toFixed(2);
        data[i].totalclosepl = parseFloat(data[i].closepl - data[i].totalfee).toFixed(2);   // 净盈亏 = 盈亏 - 总手续费

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
    console.log('keyWord= ', keyWord)
    var filterData= [] ;   // 过滤后的数据
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
* @desc 计算总计数据
* @author lizhexi
* @param {Array} selData   - 查询出来的所有订单数据
*/
function totalDataCalc(selData){
    var totalDataCell = {};    // 总计数据模型
    //初始化
    totalDataCell.sumprevol = parseInt(0)
    totalDataCell.sumshortprevol = parseInt(0)
    totalDataCell.sumbuytradevol = parseInt(0)
    totalDataCell.sumbuytradeamt = parseFloat(0.00)
    totalDataCell.sumselltradevol = parseInt(0)
    totalDataCell.sumselltradeamt = parseFloat(0.00)
    totalDataCell.sumtotalfee = parseFloat(0.00)

    totalDataCell.sumclosepl = parseFloat(0.00)
    totalDataCell.sumtotalclosepl = parseFloat(0.00)


    for(var i=0;i<selData.length;i++){
        totalDataCell.sumprevol += (!isNaN(selData[i].prevol) ? parseInt(selData[i].prevol) : 0)
        totalDataCell.sumshortprevol += (!isNaN(selData[i].shortprevol) ? parseInt(selData[i].shortprevol) : 0)
        totalDataCell.sumbuytradevol += (!isNaN(selData[i].buytradevol) ? parseInt(selData[i].buytradevol) : 0)
        totalDataCell.sumbuytradeamt+= (!isNaN(selData[i].buytradeamt) ? parseFloat(selData[i].buytradeamt) : 0)
        totalDataCell.sumselltradevol += (!isNaN(selData[i].selltradevol) ? parseInt(selData[i].selltradevol) : 0)
        totalDataCell.sumselltradeamt += (!isNaN(selData[i].selltradeamt) ? parseFloat(selData[i].selltradeamt) : 0)
        totalDataCell.sumtotalfee += (!isNaN(selData[i].totalfee) ? parseFloat(selData[i].totalfee) : 0)
        totalDataCell.sumclosepl += (!isNaN(selData[i].closepl) ? parseFloat(selData[i].closepl) : 0)
        totalDataCell.sumtotalclosepl += (!isNaN(selData[i].totalclosepl) ? parseFloat(selData[i].totalclosepl) : 0)

    }

    for(var obj in totalDataCell){
        totalDataCell[obj] = parseFloat(totalDataCell[obj]).toFixed(2);
    }

    return totalDataCell;
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
        || order.cname.toString().match(keyWord));
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
    sql = "CALL pr_trd002('" + inPutParm.trid + "', '" + inPutParm.begindate + "', '" + (inPutParm.enddate ?inPutParm.enddate : inPutParm.begindate)  + "')";

    ison.db.query(sql, function(err, rows, fields) {
        if(!err){
//查询处理数据
            var rowRet = rows[0]
            formatData(rowRet)
            var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
            var totalDataCell = retData.total_data
            var cols = []
            var rows = []
//写入表格
            var titles = [
                "序号","交易日","证券代码","证券名称","上日多仓量","上日多仓成本",
                "上日空仓量","上日空仓成本","本日买入数量","本日买入金额","本日卖出数量",
                "本日卖出金额","本日结算价","本日多仓数量","本日多仓成本价","本日空仓数量",
                "本日空仓成本价","本日费用","平隔夜仓盈亏","浮动盈亏","本日盈亏","本日净盈亏",
            ]
            var totalTitles = [
                "上日总多仓量","上日总空仓量","本日总买入量","本日总买金额",
                "本日总卖量","本日总卖金额","本日总盈亏","本日总费用","本日总净盈亏",
            ]

           //规定列数和类别
            for(var i=0; i<titles.length; i++){
                var item = {}
                item.caption = '';
                item.width = 80
                cols.push(item)
            }
            //空白行
            var blankRow =[]
            for(var k=0;k<titles.length;k++){
                    blankRow.push('')
                }
                //查询时间及表名
                var item = []
                item[0]="交易单元股票汇总表(TRD002)"
                item[1]="查询日期："
                item[2]=inPutParm.begindate;
                for(var i=3;i<titles.length;i++){
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
                totalDataItem.push(totalDataCell.sumprevol);
                totalDataItem.push(totalDataCell.sumshortprevol);
                totalDataItem.push(totalDataCell.sumbuytradevol);
                totalDataItem.push(totalDataCell.sumbuytradeamt);
                totalDataItem.push(totalDataCell.sumselltradevol);
                totalDataItem.push(totalDataCell.sumselltradeamt);
                totalDataItem.push(totalDataCell.sumclosepl);
                totalDataItem.push(totalDataCell.sumtotalfee);
                totalDataItem.push(totalDataCell.sumtotalclosepl);
                for(var i=totalTitles.length;i<titles.length;i++){
                    totalDataItem.push('')
                }
                rows.push(totalDataItem)
                rows.push(blankRow)
             //交易单元股票汇总
             var titleItem =[]
             for(var i=0;i<titles.length;i++){
                 titleItem.push(titles[i])
             }
             rows.push(titleItem);
            for(var i=0; i<rowRet.length; i++){
                var item = []
                item.push((i+1).toString())
                item.push(rowRet[i].trday)
                item.push(rowRet[i].cid)
                item.push(rowRet[i].cname)
                item.push(rowRet[i].prevol)
                item.push(rowRet[i].prevolprc)
                item.push(rowRet[i].preshortvol)
                item.push(rowRet[i].preshortvolprc)
                item.push(rowRet[i].buytradevol)
                item.push(rowRet[i].buytradeamt)
                item.push(rowRet[i].selltradevol)
                item.push(rowRet[i].selltradeamt)
                item.push(rowRet[i].price)
                item.push(rowRet[i].vol)
                item.push(rowRet[i].volprc)
                item.push(rowRet[i].shortvol)
                item.push(rowRet[i].shortvolprc)
                item.push(rowRet[i].totalfee)
                item.push(rowRet[i].overnightpl)
                item.push(rowRet[i].floatamt)
                item.push(rowRet[i].closepl)
                item.push(rowRet[i].totalclosepl)

                rows.push(item)
            }

            excel.export(postman, cols, rows)
        }else{
            console.log(err)
        }
    });
}
</script>


<script>
var curTrid = ''                /** 当前选择的trid */
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
    },
}

export function data() {
    return {
        "signalDataCells": [],
        "totalDataCell" : {
            "sumprevol" : 0,
            "sumshortprevol" : 0,
            "sumbuytradevol" : 0,
            "sumbuytradeamt" : 0,
            "sumselltradevol" : 0,
            "sumselltradeamt" : 0,
            "sumclosepl" : 0,
            "sumtotalfee" : 0,
            "sumtotalclosepl" : 0,
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
        conditions.begindate = $(".js-date").val().replace(/-/g, '')
        conditions.keyWord = $(".stock-keyword").val()
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
    }

    return conditions
}
export function updateView() {

    console.log('updateView');
    var msg = ''
    var self = this

    var sendData = getConditions()
    if(typeof sendData.errorMsg !== 'undefined'){
        csp.notify('notice', {
            msg: sendData.errorMsg,
        });
        return
    }
    console.log(sendData)
    jQuery(".ui.dimmer.tridStock").addClass("active")
    updateData(sendData, function(err, receiveData) {
        if(!receiveData.error){
            self.currentPage = curPage
            self.signalDataCells = receiveData.signalDataCells
            self.totalDataCell = receiveData.totalDataCell
            self.$refs.pagination.setPage(parseInt(receiveData.pageCount), curPage)
            msg = '恭喜你，数据查询成功！'
            jQuery(".ui.dimmer.tridStock").removeClass("active")
            csp.fixTableHead("js-trid-stock-table", "100%", "100%")
        } else{
            msg = '查询失败'
            jQuery(".ui.dimmer.triStock").removeClass("active")
        }
        csp.notify('notice', {
           msg: msg,
           delay: 15000,
       });
    })

}

export function ready() {
  console.log("--------------->TridStockTable ready")

  var self = this
  var maid ='';
  getMaid(function(err,data){
      if(!err){
          maid = data.maid;
          console.log(maid)
           self.$refs.trid_dropdown.updateDropdownList(maid)
      }
  })



  var today = new Date().format("yyyy-MM-dd");
  jQuery('.js-date').val(today);

  jQuery('.js-date').datepicker({
      changeMonth: true,
      changeYear : true,
    onClose:function (dateText,inst){
       date = $(this).datepicker("getDate");
       curPage = 1
     }
  });

  jQuery(window).resize(function(){
      csp.fixTableHead("js-trid-stock-table", "100%", "100%")
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
