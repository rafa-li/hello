<!--
/**
* @file 资产账户交易明细查询
* @author luchenqun
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
*/
-->
<template class="TradeDetail">
<div class="header">
    <h3 style="float:left">资产账户交易明细查询(ACT001)</h3>
     <div class="ui icon input" style="float: right;">
        <input class="js-key-world" type="text" placeholder="请过滤后精确查询" style="border-radius:15px;">
        <i class="search icon"></i>
    </div>
</div>
<div class="data-container">
    <div class="data">
        <p class="title">资产账户交易明细</p>
        <div class="ui above">
            <widget-acid-dropdown v-ref:acid_dropdown></widget-acid-dropdown>
            <div class="ui dropdown date js-date-condition" style="z-index:101">
                <input type="hidden" name="above-date">
                <div class="text">查看多天</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item multiple" data-value="multiple-day">查看多天</div>
                    <div class="item singal" data-value="singal-day">只查一天</div>
                </div>
            </div>
            <div class="ui icon input" style="margin-right:2px;">
                <input class="js-date-begin" type="text"  readonly="readonly">
                <i class="calendar outline icon"></i></div>
            <span>-</span>
            <div class="ui icon input end" style="margin-left:2px;">
                <input class="js-date-end" type="text"  readonly="readonly">
                <i class="calendar outline icon"></i>
            </div>
            <div class="ui compact multiple selection dropdown js-order-condition" style="z-index:100">
                <input type="hidden" name="filters">
                <i class="dropdown icon"></i>
                <span class="default text" style="font-family:SimSun;color:#999">订单状态过滤</span>
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
                <table id="js-taact-trade-detail-table" class="ui single line selectable striped table">
                    <thead id="fix-header">
                        <tr>
                            <th style="text-align:center">序号</th>
                            <th style="text-align:center">日期</th>
                            <th style="text-align:center">资产账户订单号</th>
                            <th style="text-align:center">交易单元订单号</th>
                            <th style="text-align:center">券商订单号</th>
                            <th style="text-align:center">证券代码</th>
                            <th style="text-align:center">证券名称</th>
                            <th style="text-align:center">买卖类型</th>
                            <th style="text-align:center">业务名称</th>
                            <th style="text-align:center">发单时间</th>
                            <th style="text-align:center">撤单时间</th>
                            <th style="text-align:center">委托价格</th>
                            <th style="text-align:center">委托数量</th>
                            <th style="text-align:center">交易单元</th>
                            <th style="text-align:center">交易员</th>
                            <th style="text-align:center">是否补单</th>
                            <th style="text-align:center">成交数量</th>
                            <th style="text-align:center">成交金额</th>
                            <th style="text-align:center">成交均价</th>
                            <th style="text-align:center">税金</th>
                            <th style="text-align:center">过户费</th>
                            <th style="text-align:center">手续费</th>
                            <th style="text-align:center">其它费</th>
                            <th style="text-align:center">买入发生金额</th>
                            <th style="text-align:center">卖出发生金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in signalDataCells" >
                            <td>{{$index + 1 + (currentPage-1) * 15}}</td>
                            <td>{{item.trday}}</td>
                            <td>{{item.act_orderid}}</td>
                            <td>{{item.trd_orderid}}</td>
                            <td>{{item.borderid}}</td>
                            <td>{{item.code}}</td>
                            <td>{{item.cname}}</td>
                            <td class="center aligned">{{item.side}}</td>
                            <td>{{item.cmdname}}</td>
                            <td>{{item.ordertm}}</td>
                            <td>{{item.cancelordertm}}</td>
                            <td class="right aligned">{{item.price}}</td>
                            <td>{{item.volume}}</td>
                            <td>{{item.trid}}</td>
                            <td>{{item.traderid}}</td>
                            <td class="center aligned">{{item.supplement_flag}}</td>
                            <td>{{item.tradevol}}</td>
                            <td class="right aligned">{{item.tradeamt}}</td>
                            <td class="right aligned">{{item.avgprice}}</td>
                            <td class="right aligned">{{item.taxfee}}</td>
                            <td class="right aligned">{{item.transfee}}</td>
                            <td class="right aligned">{{item.commissionfee}}</td>
                            <td class="right aligned">{{item.otherfee}}</td>
                            <td class="right aligned">{{item.buyamt}}</td>
                            <td class="right aligned">{{item.sellamt}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="ui inverted dimmer js-update-taact-trade">
                    <div class="ui text loader">正在从后台获取数据...</div>
                </div>
            </div>

            <widget-pagination v-ref:pagination></widget-pagination>
        </div>
        <p class="title">汇总数据</p>
        <div class="ui segment below">
            <div class="ui large horizontal divided list">
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.tradeamt_total}}</div>
                        <div class="label">总成交额</div>
                    </div>
                </div>
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.taxfee_total}}</div>
                        <div class="label">总税金</div>
                    </div>
                </div>
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.transfee_total}}</div>
                        <div class="label">总过户费</div>
                    </div>
                </div>
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.commissionfee_total}}</div>
                        <div class="label">总手续费</div>
                    </div>
                </div>
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.otherfee_total}}</div>
                        <div class="label">其他总计</div>
                    </div>
                </div>
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.buyamt_total}}</div>
                        <div class="label">总买入发生金额</div>
                    </div>
                </div>
                <div class="item">
                    <div class="ui mini statistic">
                        <div class="value">{{totalDataCell.sellamt_total}}</div>
                        <div class="label">总卖出发生金额</div>
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
</template>

<style>
.TradeDetail{
    height: 100%;
    width: 100%;
    padding-top:12px;
}
.ui.divided.list .item{
        width: 10.5%;
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
    var sql = "";

    if(inPutParm.orderstat != undefined){
        sql = "CALL pr_act001('"+inPutParm.acid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"','"+inPutParm.orderstat+"')";
    } else {
        sql = "CALL pr_act001('"+inPutParm.acid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"',null)";
    }

    //console.log("SelTradeDetail-->CALL pr_act001 sql: "+sql);

    ison.db.query(sql, function(err, rows, fields) {
        if(err){
            ret.error = true
            postman(ret)
        } else{
            var rowRet = rows[0]
            // tscms_daily表中查询某只股票当天总盈亏，总净盈亏数据
            sql = "select trday, acid, cid, totalfee, totalpl from tscms_daily where acid='"+inPutParm.acid+"' AND trday>='"+inPutParm.begindate+"' AND trday<='"+inPutParm.enddate+"' ";
            //console.log("SelTradeDetail-->sel total data sql: "+sql );

            ison.db.query(sql, function(err, rows){
                if(err){
                    ret.error = true
                    postman(ret)
                } else{
                    var totalData_rows = rows;
                    if(totalData_rows.length > 0){
                        for(var i=0; i<rowRet.length; i++){
                            for(var k=0; k<totalData_rows.length; k++){
                                var find = false;
                                if(rowRet[i].trday === totalData_rows[k].trday && rowRet[i].code === totalData_rows[k].cid.substr(0, 6)){
                                    rowRet[i].totalpl = totalData_rows[k].totalpl;
                                    find = true;
                                    break;
                                }
                            }

                            if(!find) {
                                rowRet[i].totalfee = 0.00;
                                rowRet[i].totalpl = 0.00;
                            }
                        }
                    }
                    if(inPutParm.page != undefined && inPutParm.pageCount != undefined){
                        formatData(rowRet)
                        var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
                        ret.signalDataCells = retData.detail_data
                        ret.totalDataCell = retData.total_data
                        ret.pageCount = retData.pages
                    } else{
                        ret.error = true
                    }
                    postman(ret)
                }
            })
        }
    });
}

/**
* @desc 数据过滤
* @author luchenqun lubaolin
* @param {Object} orgData   - 查询出来的所有订单数据
* @param {Int} page         - 请求的页码
* @param {Int} pageCount    - 请求分页的条数
* @param {String} keyWord   - 关键字过滤
* @returns {Object} retData - 返回过滤之后得到的数据
*/
function filterSelData(orgData, page, pageCount, keyWord){
    var filterData= [] ;    // 过滤后的数据
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
    var total_curDisplayData = {};
    total_curDisplayData.tradeamt_total = parseFloat(0.00);
    total_curDisplayData.taxfee_total = parseFloat(0.00);
    total_curDisplayData.transfee_total = parseFloat(0.00);
    total_curDisplayData.commissionfee_total = parseFloat(0.00);
    total_curDisplayData.otherfee_total = parseFloat(0.00);
    total_curDisplayData.buyamt_total = parseFloat(0.00);
    total_curDisplayData.sellamt_total = parseFloat(0.00);
    total_curDisplayData.closepl_total = parseFloat(0.00);
    total_curDisplayData.net_closepl_total = parseFloat(0.00);

    for(var i=0; i<filterData.length; i++){
        total_curDisplayData.tradeamt_total += parseFloat(filterData[i].tradeamt);
        total_curDisplayData.taxfee_total += parseFloat(filterData[i].taxfee);
        total_curDisplayData.transfee_total += parseFloat(filterData[i].transfee);
        total_curDisplayData.commissionfee_total += parseFloat(filterData[i].commissionfee);
        total_curDisplayData.otherfee_total += parseFloat(filterData[i].otherfee);
        total_curDisplayData.buyamt_total += parseFloat(filterData[i].buyamt);
        total_curDisplayData.sellamt_total += parseFloat(filterData[i].sellamt);
    }

    // 总盈亏
    var tmp_pl_Obj = {};  // 同一天，同一只股票的总盈亏，总净盈亏只算一次,因为每条数据都是一样的，总盈亏,ex:{"20160113-600031":105.23,"20160113-000002":80.90}
    for(var i=0; i<filterData.length; i++){
        tmp_pl_Obj[filterData[i].trday + "-" + filterData[i].code] = filterData[i].totalpl; // 每只股票，当日的总盈亏
    }
    for(var obj in tmp_pl_Obj){
        total_curDisplayData.closepl_total += parseFloat(tmp_pl_Obj[obj]);
    }

    //总净盈亏:总盈亏-总费用
    total_curDisplayData.net_closepl_total = total_curDisplayData.closepl_total
                                        -total_curDisplayData.taxfee_total
                                        -total_curDisplayData.transfee_total
                                        -total_curDisplayData.commissionfee_total
                                        -total_curDisplayData.otherfee_total;

    for(var obj in total_curDisplayData){
        total_curDisplayData[obj]= parseFloat(total_curDisplayData[obj]).toFixed(2);
    }

    var retData = {};
    retData.total_data = total_curDisplayData;                             // 统计数据
    retData.pages = Math.ceil(parseFloat(filterData.length/pageCount))  // 总页码
    retData.detail_data = pageDataGet(filterData, page, pageCount);     // 过滤数据

    return retData;
}

/**
* @desc 格式化数据
* @author luchenqun lubaolin
* @param {Array} data   - 查询出来的所有订单数据
*/
function formatData(data){
    for(var i=0; i<data.length; i++){
        data[i].tradevol = notNum(data[i].tradevol) ? 0 : parseInt(data[i].tradevol).toString()
        data[i].tradeamt = notNum(data[i].tradeamt) ? 0.00 : parseFloat(data[i].tradeamt).toFixed(2);
        data[i].price = notNum(data[i].price) ? 0.00 : parseFloat(data[i].price).toFixed(2);
        data[i].volume = notNum(data[i].volume) ? 0 : parseInt(data[i].volume).toString()
        data[i].avgprice = notNum(data[i].avgprice) ? 0.00 : parseFloat(data[i].avgprice).toFixed(2);
        data[i].taxfee = notNum(data[i].taxfee) ? 0.00 : parseFloat(data[i].taxfee).toFixed(2);
        data[i].transfee = notNum(data[i].transfee) ? 0.00 : parseFloat(data[i].transfee).toFixed(2);
        data[i].commissionfee = notNum(data[i].commissionfee) ? 0.00 : parseFloat(data[i].commissionfee).toFixed(2);
        data[i].otherfee = notNum(data[i].otherfee) ? 0.00 : parseFloat(data[i].otherfee).toFixed(2);
        data[i].buyamt = notNum(data[i].buyamt) ? 0.00 : parseFloat(data[i].buyamt).toFixed(2);
        data[i].sellamt = notNum(data[i].sellamt) ? 0.00 : parseFloat(data[i].sellamt).toFixed(2);
        data[i].side = data[i].side === 'b' ? '买' : '卖'
        data[i].supplement_flag = data[i].supplement_flag === '0' ? '否' : '是'
    }
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
    var currentStartCount = (current_page-1) * pageCount;
    var tmpDisplayData = [];

    if(allData.length > currentStartCount+pageCount){
        tmpDisplayData = allData.slice(currentStartCount, currentStartCount + pageCount);
    } else {
        tmpDisplayData = allData.slice(currentStartCount, allData.length);
    }
    // console.log("allData.slice: ", currentStartCount, currentStartCount+pageCount);
    return tmpDisplayData;
}

/**
* @desc 订单关键字过滤
* @author luchenqun lubaolin
* @param {Object} order    - 查询出来的所有订单数据
* @param {String} keyWord  - 请求的当前页码
* @returns {Boolean}       - 根据关键字过滤订单。true:该订单包含该关键字，false:该订单不包含该关键字
*/
function orderKeyFilter(order, keyWord){
    var flag =  (order.trday.toString().match(keyWord)
        || order.code.toString().match(keyWord)
        || order.cname.toString().match(keyWord)
        || order.side.toString().match(keyWord)
        || order.ordertm.toString().match(keyWord)
        || order.cancelordertm.toString().match(keyWord)
        || order.trid.toString().match(keyWord)
        || order.traderid.toString().match(keyWord)
        || order.supplement_flag.toString().match(keyWord)
        || order.cmdname.toString().match(keyWord));
        return flag !== null;
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
* @author luchenqun
* @param {Object} postman   - 推送的数据对象
* @param {Object} inPutParm - 输入的数据(即查询条件)
*/
export function saveExcelFile(postman, inPutParm){
    var sql = "";
    if(inPutParm.orderstat != undefined){
        sql = "CALL pr_act001('"+inPutParm.acid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"','"+inPutParm.orderstat+"')";
    } else {
        sql = "CALL pr_act001('"+inPutParm.acid+"','"+inPutParm.begindate+"','"+inPutParm.enddate+"', null)";
    }

    ison.db.query(sql, function(err, rows, fields) {
        if(!err){
//查询处理数据
            var rowRet = rows[0]
            // tscms_daily表中查询某只股票当天总盈亏，总净盈亏数据
            sql = "select trday, acid, cid, totalfee, totalpl from tscms_daily where acid='"+inPutParm.acid+"' AND trday>='"+inPutParm.begindate+"' AND trday<='"+inPutParm.enddate+"' ";

            ison.db.query(sql, function(err, rows){
                if(!err){
                    var totalData_rows = rows;
                    if(totalData_rows.length > 0){
                        for(var i=0; i<rowRet.length; i++){
                            for(var k=0; k<totalData_rows.length; k++){
                                var find = false;
                                if(rowRet[i].trday === totalData_rows[k].trday && rowRet[i].code === totalData_rows[k].cid.substr(0, 6)){
                                    rowRet[i].totalpl = totalData_rows[k].totalpl;
                                    find = true;
                                    break;
                                }
                            }

                            if(!find) {
                                rowRet[i].totalfee = 0.00;
                                rowRet[i].totalpl = 0.00;
                            }
                        }
                    }
                    if(inPutParm.page != undefined && inPutParm.pageCount != undefined){
                        formatData(rowRet)
                        var retData = filterSelData(rowRet, inPutParm.page, inPutParm.pageCount, inPutParm.keyWord);
                        var totalDataCell = retData.total_data
   //写入表格
                        var cols = []
                        var rows = []
                        var titles = [
                            "序号","日期","资产账户订单号","交易单元订单号","券商订单号",
                            "证券代码","证券名称","买卖类型","业务名称","发单时间",
                            "撤单时间","委托价格","委托数量","交易单元","交易员",
                            "是否补单","成交数量","成交金额","成交均价","税金",
                            "过户费","手续费","其它费","买入发生金额","卖出发生金额",
                        ]
                        var totalTitles = [
                            "总成交额","总税金","总过户费","总手续费","其他总计",
                            "总买入发生金额","总卖出发生金额","总盈亏","总净盈亏",
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
                        item[0]="资产账户交易明细查询(ACT001)"
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
                        totalDataItem.push(totalDataCell.tradeamt_total);
                        totalDataItem.push(totalDataCell.taxfee_total);
                        totalDataItem.push(totalDataCell.transfee_total);
                        totalDataItem.push(totalDataCell.commissionfee_total);
                        totalDataItem.push(totalDataCell.otherfee_total);
                        totalDataItem.push(totalDataCell.buyamt_total);
                        totalDataItem.push(totalDataCell.sellamt_total);
                        totalDataItem.push(totalDataCell.closepl_total);
                        totalDataItem.push(totalDataCell.net_closepl_total);
                        for(var i=totalTitles.length;i<titles.length;i++){
                            totalDataItem.push('')
                        }
                        rows.push(totalDataItem)
                        rows.push(blankRow)
                        //资产账户交易明细数据
                        var titleItem =[]
                        for(var i=0;i<titles.length;i++){
                            titleItem.push(titles[i])
                        }
                        rows.push(titleItem);
                        for(var i=0; i<rowRet.length; i++){
                            var item = []
                            item.push((i+1).toString())
                            item.push(rowRet[i].trday)
                            item.push(rowRet[i].act_orderid)
                            item.push(rowRet[i].trd_orderid)
                            item.push(rowRet[i].borderid)
                            item.push(rowRet[i].code)
                            item.push(rowRet[i].cname)
                            item.push(rowRet[i].side)
                            item.push(rowRet[i].cmdname)
                            item.push(rowRet[i].ordertm)
                            item.push(rowRet[i].cancelordertm)
                            item.push(rowRet[i].price)
                            item.push(rowRet[i].volume)
                            item.push(rowRet[i].trid)
                            item.push(rowRet[i].traderid)
                            item.push(rowRet[i].supplement_flag)
                            item.push(rowRet[i].tradevol)
                            item.push(rowRet[i].tradeamt)
                            item.push(rowRet[i].avgprice)
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
                }
            })
        }
    });
}
</script>


<script>

var curAcid = ''                /** 当前选择的acid */
var curPage = 1                 /** 当前页面 */
var orderStat = '00000'         /** 过滤的订单状态 */

/**
 * @func
 * @desc vue绑定数据
 * @author luchenqun
 */
export function data() {
    return {
        "signalDataCells": [],
        "totalDataCell": {
            "tradeamt_total": 0,
            "taxfee_total": 0,
            "transfee_total": 0,
            "commissionfee_total": 0,
            "otherfee_total": 0,
            "buyamt_total": 0,
            "sellamt_total": 0,
            "closepl_total": 0,
            "net_closepl_total": 0,
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
    console.log("--------------->TaactTradeDetail ready")

    var self = this
    var maid ='';
    getMaid(function(err, data){
        if(!err){
            maid = data.maid;
             self.$refs.acid_dropdown.updateDropdownList(maid)
        }
    })

    // 查看多天 只查一天
    jQuery('.js-date-condition').dropdown("set value", "multiple-day")        // 设置查看多天为默认选项
    jQuery('.js-date-condition').dropdown({
        on: 'hover',
        onChange: function(value, title, $el) {
            console.log('-------------->', value)
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
        changeYear : true,
        onClose: function(dateText, inst) {
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
        changeYear : true,
        onClose: function(dateText, inst) {
            date = $(this).datepicker("getDate");
            curPage = 1
        }
    });

    jQuery(window).resize(function(){
        csp.fixTableHead("js-taact-trade-detail-table", "100%", "100%")
    });
}

/**
 * @var
 * @desc vue 事件(信号接收)
 * @author luchenqun
 */
export var events = {
    'acid-changed': function(acid) {
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
        conditions.begindate = $(".js-date-begin").val().replace(/-/g, '')
        conditions.enddate = $(".js-date-end").val().replace(/-/g, '')
        conditions.orderstat = orderStat
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
        conditions.keyWord = $(".js-key-world").val()
    }

    return conditions
}

/**
* @desc 更新界面
* @author luchenqun
*/
export function updateView() {
    var self = this
    var sendData = getConditions()
    console.log(sendData)
    if(typeof sendData.errorMsg !== 'undefined'){
        csp.notify('notice', {
            msg: sendData.errorMsg,
        });
        return
    }
    jQuery(".js-update-taact-trade").addClass("active")
    updateData(sendData, function(err, receiveData) {
        var msg = ''
        if(!receiveData.error){
            self.currentPage = curPage
            self.signalDataCells = receiveData.signalDataCells
            self.totalDataCell = receiveData.totalDataCell
            self.$refs.pagination.setPage(parseInt(receiveData.pageCount), curPage)
            msg = '恭喜你，数据查询成功！'
            csp.fixTableHead("js-taact-trade-detail-table", "100%", "100%")
        } else{
            msg = '查询失败'
        }
        csp.notify('notice', {
            msg: msg,
        });
        jQuery(".js-update-taact-trade").removeClass("active")
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
