<!--
/**
* @file 资产账户股票汇总表
* @author luchenqun
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
*/
-->
<template class="StockDetail">
    <div class="ui medium header">资产账户股票汇总表(ACT002)</div>
    <div class="data-container">
        <div class="data">

            <p class="title">资产账户股票汇总</p>
            <div class="ui above">
                <widget-acid-dropdown v-ref:acid_dropdown></widget-acid-dropdown>
                <span>查询日期</span>
                <div class="ui icon input">
                    <input class="js-date" type="text" readonly="readonly">
                    <i class="calendar outline icon"></i>
                </div>
                <button class="ui primary button" v-on:click="updateView">查&nbsp;询 </button>
                <button class="ui button" v-on:click="exportExcel">导&nbsp;出 </button>
                <div class="table-container">
                    <table id="js-taact-stock-detail-table" class="ui single line selectable striped table">
                        <thead id="fix-header">
                            <tr>
                                <th style="text-align:center">序号</th>
                                <th style="text-align:center">证券代码</th>
                                <th style="text-align:center">证券名称</th>
                                <th style="text-align:center">上日结算价</th>
                                <th style="text-align:center">上日多仓量</th>
                                <th style="text-align:center">上日多仓市值</th>
                                <th style="text-align:center">上日空仓量</th>
                                <th style="text-align:center">上日空仓市值</th>
                                <th style="text-align:center">本日买入数量</th>
                                <th style="text-align:center">本日买入金额</th>
                                <th style="text-align:center">本日卖出数量</th>
                                <th style="text-align:center">本日卖出金额</th>
                                <th style="text-align:center">本日结算价</th>
                                <th style="text-align:center">本日多仓数量</th>
                                <th style="text-align:center">本日多仓市值</th>
                                <th style="text-align:center">本日空仓数量</th>
                                <th style="text-align:center">本日空仓市值</th>
                                <th style="text-align:center">本日费用</th>
                                <th style="text-align:center">本日盈亏</th>
                                <th style="text-align:center">本日净盈亏</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in signalDataCells" >
                                <td>{{$index + 1 + (currentPage-1) * 15}}</td>
                                <td>{{item.stockid}}</td>
                                <td>{{item.cname}}</td>
                                <td class="right aligned">{{item.preclearprice}}</td>
                                <td>{{item.prevol}}</td>
                                <td class="right aligned">{{item.prevol_marketvalue}}</td>
                                <td>{{item.preshortvol}}</td>
                                <td class="right aligned">{{item.preshortvol_marketvalue}}</td>
                                <td>{{item.buy_tradevol}}</td>
                                <td class="right aligned">{{item.buy_tradeamt}}</td>
                                <td>{{item.sell_tradevol}}</td>
                                <td class="right aligned">{{item.sell_tradeamt}}</td>
                                <td class="right aligned">{{item.price}}</td>
                                <td>{{item.vol}}</td>
                                <td class="right aligned">{{item.vol_marketvalue}}</td>
                                <td>{{item.shortvol}}</td>
                                <td class="right aligned">{{item.shortvol_marketvalue}}</td>
                                <td class="right aligned">{{item.totalfee}}</td>
                                <td class="right aligned">{{item.closepl}}</td>
                                <td class="right aligned">{{item.net_closepl}}</td>
                            </tr>
                        </tbody>
                        <div class="ui inverted dimmer js-update-taact-stock">
                            <div class="ui text loader">正在从后台获取数据...</div>
                        </div>
                    </table>
                </div>
                <widget-pagination v-ref:pagination></widget-pagination>
            </div>
            <p class="title">汇总数据</p>
            <div class="ui segment below">
                <div class="ui large horizontal divided list">
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.prevol_total}}</div>
                            <div class="label">上日总多仓量</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.prevol_marketvalue_total}}</div>
                            <div class="label">上日总多仓市值</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.preshortvol_total}}</div>
                            <div class="label">上日总空仓量</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.preshortvol_marketvalue_total}}</div>
                            <div class="label">上日总空仓市值</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.buy_tradevol_total}}</div>
                            <div class="label">本日总买入量</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.buy_tradeamt_total}}</div>
                            <div class="label">本日总买金额</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sell_tradevol_total}}</div>
                            <div class="label">本日总卖量</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.sell_tradeamt_total}}</div>
                            <div class="label">本日总卖金额</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.vol_total}}</div>
                            <div class="label">本日总多仓量</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.vol_marketvalue_total}}</div>
                            <div class="label">本日总多仓市值</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.closepl_total}}</div>
                            <div class="label">总盈亏</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="ui mini statistic">
                            <div class="value">{{totalDataCell.net_closepl_total}}</div>
                            <div class="label">总净盈亏</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style type="text/css">
    .StockDetail{
        height: 100%;
        width: 100%;
        padding-top:12px;
    }
    .table-container{
        margin-top: 10px;
    }
    .ui.divided.list{
        margin-top: 5px;
        width: 100%;
    }
    .ui.divided.list .item{
        width: 8%;
        text-align: center;
    }
</style>

<script server>

/**
* @desc 更新数据
* @author luchenqun
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


    var sql = "CALL pr_act002('"+inPutParm.acid+"','"+inPutParm.date+"') ";
    //console.log("SelTaactStock-->CALL pr_act002 sql: " + sql);
    ison.db.query(sql, function(err, rows, fields) {
        if(err){
            ret.error = true
            postman(ret)
        } else{
            var rowRet = rows[0]
            if(typeof inPutParm.page === 'undefined'  || typeof inPutParm.pageCount === 'undefined' ){
                ret.error = true
            } else {
                formatData(rowRet)                                                                      // 格式化数据
                ret.signalDataCells = pageDataGet(rowRet, inPutParm.page, inPutParm.pageCount);         // 明细数据
                ret.totalDataCell = totalDataCalc(rowRet);                                              // 总数据
                ret.pageCount = Math.ceil(parseFloat(rowRet.length / inPutParm.pageCount))              // 总页码
            }
            postman(ret)
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
* @desc 从查询出来的数据中截取某一页的数据
* @author luchenqun lubaolin
* @param {Array} allData            - 查询出来的所有订单数据
* @param {Int} current_page         - 请求的当前页码
* @param {Int} pageCount            - 请求分页的条数
* @returns {Array} tmpDisplayData   - 返回分页之后得到的数据
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
* @desc 格式化数据
* @author luchenqun lubaolin
* @param {Array} data   - 查询出来的所有订单数据
*/
function formatData(data){
    for(var i=0; i<data.length; i++){
        data[i].stockid = data[i].cid.substring(0, 6)
        data[i].preclearprice = notNum(data[i].preclearprice) ? "0.00" :parseFloat(data[i].preclearprice).toFixed(2);
        data[i].prevol = notNum(data[i].prevol) ? "0" :  parseInt(data[i].prevol).toString();
        data[i].prevol_marketvalue = notNum(data[i].prevol_marketvalue) ? "0.00" : parseFloat(data[i].prevol_marketvalue).toFixed(2);
        data[i].preshortvol = notNum(data[i].preshortvol) ? "0" : parseInt(data[i].preshortvol).toString();
        data[i].preshortvol_marketvalue = notNum(data[i].preshortvol_marketvalue) ? "0.00" : parseFloat(data[i].preshortvol_marketvalue).toFixed(2);
        data[i].buy_tradevol = notNum(data[i].buy_tradevol ) ? "0" : parseInt(data[i].buy_tradevol).toString();
        data[i].buy_tradeamt = notNum(data[i].buy_tradeamt ) ? "0.00" : parseFloat(data[i].buy_tradeamt).toFixed(2);
        data[i].sell_tradevol = notNum(data[i].sell_tradevol ) ? "0" : parseInt(data[i].sell_tradevol).toString();
        data[i].sell_tradeamt = notNum(data[i].sell_tradeamt ) ? "0.00" : parseFloat(data[i].sell_tradeamt).toFixed(2);
        data[i].price = notNum(data[i].price)  ? "0.00" : parseFloat(data[i].price).toFixed(2);
        data[i].vol = notNum(data[i].vol) ? "0" : parseInt(data[i].vol).toString();
        data[i].vol_marketvalue = notNum(data[i].vol_marketvalue) ? "0.00" : parseFloat(data[i].vol_marketvalue).toFixed(2);
        data[i].shortvol = notNum(data[i].shortvol) ? "0" : parseInt(data[i].shortvol).toString();
        data[i].shortvol_marketvalue = notNum(data[i].shortvol_marketvalue) ? "0.00" : parseFloat(data[i].shortvol_marketvalue).toFixed(2);
        data[i].totalfee = notNum(data[i].totalfee) ? "0.00" : parseFloat(data[i].totalfee).toFixed(2);
        data[i].closepl = notNum(data[i].closepl) ? "0.00" : parseFloat(data[i].closepl).toFixed(2);
        data[i].net_closepl = parseFloat(data[i].closepl - data[i].totalfee).toFixed(2);   // 净盈亏 = 盈亏 - 总手续费
    }
}

/**
* @desc 计算总计数据
* @author luchenqun lubaolin
* @param {Array} selData            - 查询出来的所有订单数据
* @returns {Object} total_dataCell  - 返回统计数据
*/
function totalDataCalc(selData){
    var total_dataCell = {};    // 总计数据模型
    total_dataCell.prevol_total=parseInt(0);//初始化
    total_dataCell.prevol_marketvalue_total=parseFloat(0.00);
    total_dataCell.preshortvol_total=parseInt(0);
    total_dataCell.preshortvol_marketvalue_total=parseFloat(0.00);
    total_dataCell.buy_tradevol_total=parseInt(0);
    total_dataCell.buy_tradeamt_total=parseFloat(0.00);
    total_dataCell.sell_tradevol_total=parseInt(0);
    total_dataCell.sell_tradeamt_total=parseFloat(0.00);
    total_dataCell.vol_total=parseInt(0);
    total_dataCell.vol_marketvalue_total=parseFloat(0.00);
    total_dataCell.shortvol_total=parseInt(0);
    total_dataCell.shortvol_marketvalue_total=parseFloat(0.00);

    total_dataCell.closepl_total = parseFloat(0.00);
    total_dataCell.net_closepl_total = parseFloat(0.00);

    for(var i=0;i<selData.length;i++){
        total_dataCell.prevol_total += parseInt(selData[i].prevol);
        total_dataCell.prevol_marketvalue_total += parseFloat(selData[i].prevol_marketvalue);
        total_dataCell.preshortvol_total += parseInt(selData[i].preshortvol);
        total_dataCell.preshortvol_marketvalue_total += parseFloat(selData[i].preshortvol_marketvalue);
        total_dataCell.buy_tradevol_total += parseInt(selData[i].buy_tradevol);
        total_dataCell.buy_tradeamt_total += parseFloat(selData[i].buy_tradeamt);
        total_dataCell.sell_tradevol_total += parseInt(selData[i].sell_tradevol);
        total_dataCell.sell_tradeamt_total += parseFloat(selData[i].sell_tradeamt);
        total_dataCell.vol_total += parseInt(selData[i].vol);
        total_dataCell.vol_marketvalue_total += parseFloat(selData[i].vol_marketvalue);
        total_dataCell.closepl_total += parseFloat(selData[i].closepl);
        total_dataCell.net_closepl_total += parseFloat(selData[i].net_closepl);
        total_dataCell.shortvol_total += parseInt(selData[i].shortvol);
        total_dataCell.shortvol_marketvalue_total += parseFloat(selData[i].shortvol_marketvalue);
    }

    for(var obj in total_dataCell){
        total_dataCell[obj] = parseFloat(total_dataCell[obj]).toFixed(2);
    }

    return total_dataCell;
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
    sql = "CALL pr_act002('"+inPutParm.acid+"','"+inPutParm.date+"') ";
    ison.db.query(sql, function(err, rows, fields) {
        if(!err){
//查询处理数据
            var rowRet = rows[0]
            if(typeof inPutParm.page !== 'undefined'  && typeof inPutParm.pageCount !== 'undefined' ){
                formatData(rowRet)
                var totalDataCell = totalDataCalc(rowRet);
//写入表格
                var cols = []
                var rows = []
                var titles = [
                    "序号","证券代码","证券名称","上日结算价","上日多仓量","上日多仓市值",
                    "上日空仓量","上日空仓市值","本日买入数量","本日买入金额","本日卖出数量",
                    "本日卖出金额","本日结算价","本日多仓数量","本日多仓市值","本日空仓数量",
                    "本日空仓市值","本日费用","本日盈亏","本日净盈亏",
                ]
                var totalTitles = [
                    "上日总多仓量","上日总多仓市值","上日总空仓量","上日总空仓市值",
                    "本日总买入量","本日总买金额","本日总卖量","本日总卖金额",
                    "本日总多仓量","本日总多仓市值","总盈亏","总净盈亏",
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
                    item[0]="资产账户股票汇总表(ACT001)"
                    item[1]="查询日期："
                    item[2]=inPutParm.date;
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
                    totalDataItem.push(totalDataCell.prevol_total);
                    totalDataItem.push(totalDataCell.prevol_marketvalue_total);
                    totalDataItem.push(totalDataCell.preshortvol_total);
                    totalDataItem.push(totalDataCell.preshortvol_marketvalue_total);
                    totalDataItem.push(totalDataCell.buy_tradevol_total);
                    totalDataItem.push(totalDataCell.buy_tradeamt_total);
                    totalDataItem.push(totalDataCell.sell_tradevol_total);
                    totalDataItem.push(totalDataCell.sell_tradeamt_total);
                    totalDataItem.push(totalDataCell.vol_total);
                    totalDataItem.push(totalDataCell.vol_marketvalue_total);
                    totalDataItem.push(totalDataCell.closepl_total);
                    totalDataItem.push(totalDataCell.net_closepl_total);
                    for(var i=totalTitles.length;i<titles.length;i++){
                        totalDataItem.push('')
                    }
                    rows.push(totalDataItem)
                    rows.push(blankRow)
                    //资产账户股票汇总数据
                    var titleItem =[]
                    for(var i=0;i<titles.length;i++){
                        titleItem.push(titles[i])
                    }
                    rows.push(titleItem);
                    for(var i=0; i<rowRet.length; i++){
                        var item = []
                        item.push((i+1).toString())
                        item.push(rowRet[i].stockid)
                        item.push(rowRet[i].cname)
                        item.push(rowRet[i].preclearprice)
                        item.push(rowRet[i].prevol)
                        item.push(rowRet[i].prevol_marketvalue)
                        item.push(rowRet[i].preshortvol)
                        item.push(rowRet[i].preshortvol_marketvalue)
                        item.push(rowRet[i].buy_tradevol)
                        item.push(rowRet[i].buy_tradeamt)
                        item.push(rowRet[i].sell_tradevol)
                        item.push(rowRet[i].sell_tradeamt)
                        item.push(rowRet[i].price)
                        item.push(rowRet[i].vol)
                        item.push(rowRet[i].vol_marketvalue)
                        item.push(rowRet[i].shortvol)
                        item.push(rowRet[i].shortvol_marketvalue)
                        item.push(rowRet[i].totalfee)
                        item.push(rowRet[i].closepl)
                        item.push(rowRet[i].net_closepl)
                        rows.push(item)
                    }
                    excel.export(postman, cols, rows)

            }

        }
    });
}
</script>


<script>
var curAcid = ''                /** 当前选择的acid */
var curPage = 1                 /** 当前页面 */

/**
 * @func
 * @desc vue绑定数据
 * @author luchenqun
 */
export function data() {
    return {
        "signalDataCells": [],
        "totalDataCell" : {
            "prevol_total":0,
            "prevol_marketvalue_total":0.00,
            "preshortvol_total":0,
            "preshortvol_marketvalue_total":0.00,
            "buy_tradevol_total":0,
            "buy_tradeamt_total":0.00,
            "sell_tradevol_total":0,
            "sell_tradeamt_total":0.00,
            "vol_total":0,
            "vol_marketvalue_total":0.00,
            "closepl_total":0.00,
            "net_closepl_total":0.00,
        },
        "currentPage":0,
    }
}

/**
 * @func
 * @desc 初始化
 * @author luchenqun
 */
export function ready() {
    console.log("--------------->TaactTradeDetail ready");

    var self = this
    var maid ='';
    getMaid(function(err,data){
        if(!err){
            maid = data.maid;
            console.log(maid)
             self.$refs.acid_dropdown.updateDropdownList(maid)
        }
    })



    var today = new Date().format("yyyy-MM-dd");
    jQuery('.js-date').val(today);
    jQuery('.js-date').datepicker({
        changeMonth: true,
        changeYear : true,
        onClose:function (dateText, inst){
            date = $(this).datepicker("getDate");
            curPage = 1
        },
    });

    jQuery(window).resize(function(){
        csp.fixTableHead("js-taact-stock-detail-table", "100%", "100%")
    });
}

/**
 * @var
 * @desc vue 事件(信号接收)
 * @author luchenqun
 */
export var  events = {
    'acid-changed': function (acid) {
        curAcid = acid
        curPage = 1
        console.log('------------>', acid)
    },
    'page-changed': function(currentPage) {
        curPage = currentPage
        console.log('I have receive a page_changed singal, current_page = ', currentPage)
        this.updateView()
    },
}

/**
* @desc 获取查询条件
* @author luchenqun
* @returns {Object} conditions  - 查询条件
*/
export function getConditions(){
    var conditions = {}
    if(curAcid === ''){
        conditions.errorMsg = "您需要先选择资产账户"
    }else{
        conditions.acid = curAcid
        conditions.date = $(".js-date").val().replace(/-/g, '')
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
    }

    return conditions
}

/**
* @desc 更新界面
* @author luchenqun
*/
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

    jQuery(".js-update-taact-stock").addClass("active")
    console.log(sendData)
    updateData(sendData, function(err, receiveData) {
        if(!receiveData.error){
            self.currentPage = curPage
            self.signalDataCells = receiveData.signalDataCells
            self.totalDataCell = receiveData.totalDataCell
            self.$refs.pagination.setPage(parseInt(receiveData.pageCount), curPage)
            msg = '恭喜你，数据查询成功！'
            csp.fixTableHead("js-taact-stock-detail-table", "100%", "100%")
        } else{
            msg = '查询失败'
        }
        csp.notify('notice', {
            size: 'mini',
            icon: false,
            msg: msg,
            delay: 15000
        });
        jQuery(".js-update-taact-stock").removeClass("active")

    })
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
