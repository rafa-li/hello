<!--
/**
* @file 交易小组管理
* @author luchenqun luke
* @version 1.0
* @copyright 2016 All Right Reserved @ LeHighHongking
*/
-->
<template class="TradeTeam">

<div class="ui medium header"> 交易小组管理 </div>
<div class="data-container">
<div class="data">
<div>
    <widget-trid-dropdown v-ref:trid_dropdown0></widget-trid-dropdown>
    <button class="ui primary button" v-on:click="updateModalState('js-team-create-page', 'show')" style="margin-left:0;"> 新建小组 </button>
    <button class="ui button" v-on:click="refreshTeam"> 刷新 </button>
</div>
<div class="table-container">
    <table class="ui single line selectable striped table">
    <thead id="fix-header">
        <tr>
            <th>序号</th>
            <th>交易单元</th>
            <th>小组名称</th>
            <th>小组人数</th>
            <th>小组成员</th>
            <th>小组总BP</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in teams">
            <td>{{$index + 1 + (currentPage-1) * 15}}</td>
            <td>{{item.trname}}</td>
            <td>{{item.tname}}</td>
            <td>{{item.memberCount}}</td>
            <td>{{item.memberName}}</td>
            <td>{{item.bp}}</td>
            <td>
                <a class="js-team-modify-btn" tid="{{ item.tid}}" trid="{{ item.trid }}" tname="{{ item.tname }}">修改</a> &nbsp;&nbsp;
                <a class="js-team-del-btn" tid="{{ item.tid}}" trid="{{ item.trid }}" tname="{{ item.tname }}">删除</a> &nbsp;&nbsp;
                <a class="js-team-show-btn" tid="{{ item.tid}}" trid="{{ item.trid }}" tname="{{ item.tname }}">详情</a>
            </td>
        </tr>
    </tbody>
    </table>
    <div class="ui inverted dimmer js-update-view">
        <div class="ui text loader">正在更新界面...</div>
    </div>
</div>
 <widget-pagination v-ref:pagination></widget-pagination>

<div class="ui modal js-team-modify-page">
    <i class="close icon"></i>
    <div class="header"> 修改小组</div>
    <div class="modal-content">
        <div style="float:left;">
            <div class="ui sub header"> 交易单元 </div>
            <div style="width:5px; height:5px"></div>
            <div class="ui disabled input width">
                <input class="js-team-modify-trname" type="text" disabled="disabled" value="{{ singalTeam[0].trname }}">
            </div>
        </div>
        <div style="float:right;" >
            <div class="ui sub header"> 小组名称 </div>
            <div style="width:5px; height:5px"></div>
            <div class="ui input width">
                <input class="js-team-modify-tname" type="text" v-model="{{ singalTeam[0].tname }}" value="{{ singalTeam[0].tname }}" tid="{{ singalTeam[0].tid }}">
            </div>
        </div>
        <div class="modal table-container">
            <table class="ui single line selectable striped table" >
                <thead id="fix-header">
                    <tr>
                        <th><!-- <div class="ui checkbox js-team-modify-checkbox"><input type="checkbox" name="{{ trader.traderid }}"><label></label></div> --></th>
                        <th>交易员ID</th>
                        <th>交易员姓名</th>
                        <th>交易员等级</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="trader in traders">
                        <td>
                            <div class="ui checkbox js-team-modify-checkbox"  traderid="{{ trader.traderid }}" trid="{{ trader.trid }}"><input type="checkbox" name=""{{ trader.traderid }}""><label></label></div>
                        </td>
                        <td>{{ trader.traderid }}</td>
                        <td>{{ trader.oname }}</td>
                        <td>Lv.1</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="actions">
        <div class="ui button" v-on:click="updateModalState('js-team-modify-page', 'hide')">取消</div>
        <div class="ui green button" v-on:click="modifyTeamConfirm">确定</div>
    </div>
</div>

<div class="ui modal js-team-create-page">
    <i class="close icon"></i>
    <div class="header"> 新建小组 </div>
    <div class="modal-content">
        <div style="float:left;">
            <div class="ui sub header"> 交易单元 </div>
            <div style="width:5px; height:5px"></div>
            <widget-trid-dropdown v-ref:trid_dropdown1></widget-trid-dropdown>
        </div>
        <div style="float:right;" >
            <div class="ui sub header"> 小组名称 </div>
            <div style="width:5px; height:5px"></div>
            <div class="ui input width">
                <input class="js-create-team-name" type="text" placeholder="请输入小组名称">
            </div>
        </div>
        <div class="modal table-container">
            <table class="ui single line selectable striped table" >
                <thead id="fix-header">
                    <tr>
                        <th><!-- <div class="ui checkbox"><input type="checkbox" name="example"><label></label></div> --></th>
                        <th>交易员ID</th>
                        <th>交易员姓名</th>
                        <th>交易员等级</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="trader in traders">
                        <td>
                            <div class="ui checkbox js-team-create-checkbox" traderid="{{ trader.traderid }}" trid="{{ trader.trid }}"><input type="checkbox" name="{{ trader.traderid }}"><label></label></div>
                        </td>
                        <td>{{ trader.traderid }}</td>
                        <td>{{ trader.oname }}</td>
                        <td>Lv.1</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="actions">
        <div class="ui button" v-on:click="updateModalState('js-team-create-page', 'hide')">取消</div>
        <div class="ui green button" v-on:click="createTeamConfirm">确定</div>
    </div>
</div>

<div class="ui modal js-team-detail-page">
    <i class="close icon"></i>
    <div class="header"> 小组详情 </div>
    <div class="modal-content">
        <div style="float:left;">
            <div class="ui sub header"> 交易单元 </div>
            <div style="width:5px; height:5px"></div>
            <div class="ui disabled input width">
                <input class="js-team-detail-trname" type="text" value="{{ singalTeam[0].trname }}">
            </div>
        </div>
        <div style="float:right;" >
            <div class="ui sub header"> 小组名称 </div>
            <div style="width:5px; height:5px"></div>
            <div class="ui disabled input width">
                <input class="js-team-detail-tname" type="text" value="{{ singalTeam[0].tname }}">
            </div>
        </div>
        <div class="modal table-container">
            <table class="ui single line selectable striped table" >
                <thead id="fix-header">
                    <tr>
                        <th>交易员ID</th>
                        <th>交易员姓名</th>
                        <th>交易员等级</th>
                        <th>最大BP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="trader in singalTeam">
                        <td>{{ trader.traderid }}</td>
                        <td>{{ trader.oname }}</td>
                        <td>Lv.1</td>
                        <td>{{ trader.bp }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="actions">
        <div class="ui green button" v-on:click="updateModalState('js-team-detail-page', 'hide')">确定</div>
    </div>
</div>

<div class="ui small modal js-team-del-page">
    <i class="close icon"></i>
    <div class="header"> 提示 </div>
    <div class="modal-del">
        <div>
          你确定删除你的小组吗？删除后将无法恢复！
        </div>
    </div>
    <div class="actions">
      <div class="ui negative button" v-on:click="updateModalState('js-team-del-page', 'hide')">否 </div>
      <div class="ui positive right labeled icon button" v-on:click="delTeamConfirm">Yes <i class="checkmark icon"></i> </div>
    </div>
</div>

</div>
</div>
</template>

<style>
.ui.modal .actions{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
}

.ui.sub.header{
    opacity: 0.8;
    margin-bottom: 5px;
}
.ui.selection.dropdown.width,.ui.input.width{
    width: 200px;
}
.ui.modal.js-team-detail-page .ui.selection.dropdown.width,.ui.modal.js-team-detail-page .ui.input.width{
    pointer-events: none;
}
.ui.modal.js-team-modify-page,.ui.modal.js-team-create-page,.ui.modal.js-team-detail-page{
    width: 526px;
    height: 598px;
}
.modal-content{
    margin: 20px 24px 0 20px;
    height: 470px;
}

.modal-del{
    margin: 20px 24px 0 20px;
    height: 100px;
}

.TradeTeam{
    height: 100%;
    width: 100%;
    padding-top:12px;
}

 </style>

<script server>
/**
 * @desc 根据交易单元，获取所有的交易员
 * @author luchenqun
 * @param {Object} postman  - 推送的数据对象
 * @param {String} trid     - 交易单元
 */
export function getTraders(postman, trid) {
    var sql = "select c.traderid, tp.oname, a.trid, a.trname, a.caid, b.caname from tstrader c INNER JOIN tsoper tp ON tp.`oid` = c.`traderid` , tatrd a, tacap b where a.`caid` = b.`caid` and  a.`trid` = '"+ trid +"' and c.trid = a.trid ORDER BY a.trid";
    console.log(sql)
    ison.db.query(sql, function(err, data) {
        postman(err || data)
    })
}

/**
 * @desc 获取所有的加入小组的交易员
 * @author luchenqun
 * @param {Object} postman  - 推送的数据对象
 */
export function getJoinedTraders(postman) {
    var sql = "select * from csp_team_member";
    ison.db.query(sql, function(err, data) {
        postman(err || data)
    })
}

/**
 * @desc 根据资产管理人，获取所有小组信息
 * @author luchenqun
 * @param {Object} postman  - 推送的数据对象
 * @param {String} maid     - 资产管理人
 */
export function getTeams(postman, inPutParm) {
    console.log("inPutParm--->",inPutParm)
    var sql = "SELECT ti.tid, ti.tname, ti.trid, td.trname, tm.traderid, tr.oname, trd.bp FROM csp_team_info as ti LEFT JOIN tatrd as td ON ti.trid=td.trid LEFT JOIN csp_team_member as tm ON ti.tid=tm.tid LEFT JOIN tsoper as tr ON tr.oid=tm.traderid LEFT JOIN tstrader as trd ON (trd.trid=tm.trid AND trd.traderid=tm.traderid) WHERE ti.trid = '"+ inPutParm.trid +" ' ORDER BY tid";
    var ret ={
        "error":false,
        "theTeams":[],
        "pages":0,
    }
    ison.db.query(sql, function(err, data) {

        if(!err){
        //console.log(sql, "--->", data)

        data.push({tid:-1})  // 主要是为了方便写后面的for循环逻辑

        var length = data.length

        var teams = []
        var curTid = data[0].tid

        var tid = ''
        var trid = ''
        var trname = ''
        var tname = ''
        var teamMemberName = ''
        var teamMemberCount = 0
        var teamBp = 0

        for(var i=0; i<length && length > 1; i++){
            if(curTid !== data[i].tid){
                curTid = data[i].tid
                var item = {
                    "tid": tid,
                    "trname": trname,
                    "tname": tname,
                    "memberCount": teamMemberCount,
                    "memberName": teamMemberName,
                    "bp": teamBp,
                    "trid": trid,
                };
                teams.push(item)

                teamMemberName = ''
                teamMemberCount = 0
                teamBp = 0
            }

            tid = data[i].tid
            trid = data[i].trid
            trname = data[i].trname
            tname = data[i].tname

            // 有可能小组里面没有人
            if(data[i].traderid !== null){
                teamMemberName += (data[i].oname + ' ')
                teamBp += parseFloat(data[i].bp)
                teamMemberCount++;
            }
        }
        ret.theTeams = pageDataGet(teams,inPutParm.page,inPutParm.pageCount)
        ret.pages = Math.ceil(parseFloat(teams.length/inPutParm.pageCount))  // 总页码
        postman(ret)
    }else{
        console.log(err)
        ret.error = true
        postman(ret)
    }
    })
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
 * @desc 根据小组id，获取小组信息
 * @author luchenqun
 * @param {Object} postman  - 推送的数据对象
 * @param {String} tid     - 小组id
 */
export function getTeam(postman, tid) {
    var sql = "SELECT ti.tid, ti.tname, ti.trid, td.trname, tm.traderid, tr.oname, trd.bp FROM `csp_team_info` as ti LEFT JOIN tatrd as td ON ti.trid=td.trid LEFT JOIN csp_team_member as tm ON ti.tid=tm.tid LEFT JOIN tsoper as tr ON tr.oid=tm.traderid LEFT JOIN tstrader as trd ON (trd.trid=tm.trid AND trd.traderid=tm.traderid) WHERE ti.`tid`= '"+ tid +"'";
    ison.db.query(sql, function(err, data) {
        console.log(sql, "--->", JSON.stringify(data))
        postman(err || data)
    })
}

/**
 * @desc 插入一个小组
 * @author luchenqun
 * @param {Object} postman   - 推送的数据对象
 * @param {String} tname     - 小组名称
 * @param {Array} traders    - 交易员
 */
export function insertTeam(postman, tname, traders){
    var trid = traders[0].trid
    var sql = "INSERT INTO `csp_team_info` (`tname`, `trid`) VALUES ('"+ tname +"', '"+ trid +"')"
    ison.db.query(sql, function(err, data) {
        if(err){
            postman(err || data)
        } else {
            sql = "select IFNULL(max(tid), 0) as max_tid from csp_team_info"
            ison.db.query(sql, function(err, data) {
                if(err){
                    postman(err || data)
                } else {
                    postman("insertTeam success")
                    if(traders.length > 0){
                        var max_tid = data[0].max_tid
                        sql = "INSERT INTO `csp_team_member` (`traderid`, `trid`, `tid`) VALUES "
                        for(var i=0; i<traders.length; i++){
                            if(i >= 1){
                                sql += ","
                            }
                            sql +=  "('"+ traders[i].traderid +"', '"+ traders[i].trid +"', '"+ max_tid+"')";
                        }
                        ison.db.query(sql, function(err, data) {
                            if(!err){
                                console.log(JSON.stringify(traders) + " insert success")
                            }
                        })
                    }
                }
            })
        }
    })
}

/**
 * @desc 删除一个小组
 * @author luchenqun
 * @param {Object} postman   - 推送的数据对象
 * @param {String} tid       -小组id
 */
export function delTeam(postman, tid){
    var sql = "DELETE FROM `csp_team_member` WHERE `tid`='"+ tid +"'"
    ison.db.query(sql, function(err, data) {
        sql = "DELETE FROM `csp_team_info` WHERE `tid`='"+ tid +"'"
        ison.db.query(sql, function(err, data) {
            postman("del success")
        })
    })
}

/**
 * @desc 更新一个小组
 * @author luchenqun
 * @param {Object} postman   - 推送的数据对象
 * @param {String} tid       -小组id
 * @param {String} tname     -小组名字
 * @param {String} traders   -选择的交易员
 */
export function updateTeam(postman, tid, tname, traders){
    var sql = "UPDATE `csp_team_info` SET `tname`='"+ tname +"' WHERE (`tid`='"+ tid +"')"
    ison.db.query(sql, function(err, data) {
        if(err){
            postman("updateTeam error")
        } else {
            sql = "DELETE FROM `csp_team_member` WHERE (`tid`='"+ tid +"')"
            ison.db.query(sql, function(err, data) {
                if(traders.length > 0){
                    sql = "INSERT INTO `csp_team_member` (`traderid`, `trid`, `tid`) VALUES "
                    for(var i=0; i<traders.length; i++){
                        if(i >= 1){
                            sql += ","
                        }
                        sql +=  "('"+ traders[i].traderid +"', '"+ traders[i].trid +"', '"+ tid+"')";
                    }
                    ison.db.query(sql, function(err, data) {
                        if(!err){
                            console.log(JSON.stringify(traders) + " update success")
                            postman("updateTeam success")
                        } else {
                            postman("updateTeam error")
                        }
                    })
                } else {
                    postman("updateTeam success")
                }
            })
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
    var conSQL = "SELECT conlevel ,cellid FROM tsoper_conlevel WHERE "
               + "( conlevel =28 OR conlevel =29) AND oid = '"
               + oid+"'";
    ison.db.query(conSQL,function(err,data){
        if(!err){
        //    console.log(conSQL,"------>")
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
</script>


<script>
var curTid = ''                  /** 当前点击的tid(小组id)*/
var curTrid= ''
var maid ='';
var curConlevel = ''
var curPage = 1                 /** 当前页面 */
/**
 * @func
 * @desc vue绑定数据
 * @author luchenqun
 */
export function data() {
    return {
        "traders": [],
        "teams":[],
        "singalTeam":[],
        "currentPage":0,
    }
}

/**
 * @func
 * @desc 初始化
 * @author luchenqun
 */
export function ready() {
    var self = this
            getConlevel(function(err,data){
                if(!data.error){
                    var oid = data.oid;
                    maid = oid.split(".")[0];
                    curConlevel = data.conlevel
                    if(curConlevel==29){
                        self.$refs.trid_dropdown0.updateDropdownList(maid)

                    }else{
                        curTrid = data.cellid
                            self.$refs.trid_dropdown0.updateTrid(curTrid)
                            self.$refs.trid_dropdown1.updateTrid(curTrid)
                            getTraders(curTrid,function(err, receiveData){
                                if(!err){
                                    self.traders = receiveData
                                }
                            })
                    }
                }
            })


    // 详情按钮
    jQuery(this.$el).on("click", ".js-team-show-btn", function(){
        jQuery('.js-team-detail-page').modal('show');
        var tid = jQuery($(this)).attr("tid")
        console.log(tid);
        getTeam(tid, function(err, receiveData){
            if(err){
                console.log(err)
            }else{
                console.log(JSON.stringify(receiveData))
                self.singalTeam = receiveData
            }
        })
    })

    // 修改按钮
    jQuery(this.$el).on("click", ".js-team-modify-btn", function(){
        var trid = jQuery($(this)).attr("trid")
        var tid = jQuery($(this)).attr("tid")
        var tname = jQuery($(this)).attr("tname")

        jQuery('.js-team-modify-page').modal('show');

        jQuery('.js-team-modify-tname').attr("value", tname)
        jQuery('.js-team-modify-tname').val(tname)

        console.log(trid, tid);
        getTraders(trid, function(err, receiveData){
            if(!err){
                self.traders = receiveData
                getTeam(tid, function(err, receiveData){
                    if(!err){
                        self.singalTeam = receiveData
                        jQuery(".js-team-modify-checkbox").each(function(){
                            var traderid = jQuery(this).attr("traderid")
                            for(var i=0; i<receiveData.length; i++){
                                if(traderid === receiveData[i].traderid){
                                    jQuery(this).checkbox('check')
                                    break
                                }
                            }
                        });
                    }
                })
            }
        })
    })

    // 删除按钮
    jQuery(this.$el).on("click", ".js-team-del-btn", function(){
        jQuery('.js-team-del-page').modal('show');
        curTid = jQuery($(this)).attr("tid")
    })

    // 全选按钮（估计项目经理以后会把这个需求提上去的，先准备到这里。。。）
    jQuery('.js-team-modify-checkbox').checkbox({
        onChecked: function(){
            jQuery('.js-team-modify-checkbox').checkbox('set checked')
        },
        onUnchecked: function(){
            jQuery('.js-team-modify-checkbox').checkbox('set unchecked')
        }
    });

    jQuery(".js-update-view").addClass("active")
    setTimeout(self.refreshTeam, 1000);
}

/**
 * @var
 * @desc vue 事件(信号接收)
 * @author luchenqun
 */
export var  events = {
    'trid-changed': function (trid) {
        curTrid = trid;
        this.$refs.trid_dropdown1.updateTrid(trid)
        this.refreshTeam()
        getTraders(trid, (err, receiveData)=> {
            this.traders = receiveData
        })
    },
    'page-changed': function(currentPage) {
        curPage = currentPage
        console.log('I have receive a page_changed singal, current_page = ', currentPage)
        this.refreshTeam()
    }
}
/**
* @desc 获取查询条件
* @author luchenqun lizhexi
* @returns {Object} conditions  - 查询条件
*/
export function getConditions(){
    var conditions = {}
        conditions.page = curPage
        conditions.pageCount = csp.PAGE_COUNT
        conditions.trid = curTrid

    return conditions
}


/**
 * @func
 * @desc 刷新小组
 * @author luchenqun
 */
export function refreshTeam() {
    console.log("refreshTeam")
    var self = this
    var sendData = getConditions();
    getTeams(sendData, function(err, receiveData){
        console.log(JSON.stringify(receiveData));
        if(!receiveData.error){
            console.log(JSON.stringify(receiveData))
            self.teams = receiveData.theTeams;
            self.currentPage = curPage
            self.$refs.pagination.setPage(parseInt(receiveData.pages), curPage)

        }else{
            console.log(err)
        }
        jQuery(".js-update-view").removeClass("active")
    })
}

/**
* @desc 更新弹出层的显示状态
* @author luchenqun
* @param {String} className - 弹出层的类名
* @param {String} showState - 弹出层的显示状态
*/
export function updateModalState(className, showState){
    jQuery('.' + className).modal(showState);
}

/**
 * @func
 * @desc 确认新建小组
 * @author luchenqun
 */
export function createTeamConfirm() {
    var self = this

    var tname = jQuery(".js-create-team-name").val()

    var traders = []
            if(tname!=''&&tname != null){
                            jQuery(".js-team-create-checkbox").each(function(){
                                if(jQuery(this).checkbox('is checked')){
                                    console.log(jQuery(this).attr("traderid"), jQuery(this).attr("trid"))
                                    var trader = {
                                        "traderid":jQuery(this).attr("traderid"),
                                        "trid":jQuery(this).attr("trid"),
                                    }
                                    traders.push(trader)
                                }
                            });
                            getJoinedTraders(function(err, receiveData){
                                if(!err){
                                    var joinedTraders = receiveData
                                    var existingTraders = []
                                    for(var i=0; i<joinedTraders.length; i++){
                                        for(var j=0; j<traders.length; j++){
                                            if(joinedTraders[i].traderid === traders[j].traderid){
                                                existingTraders.push(joinedTraders[i])
                                            }
                                        }
                                    }

                                    if(existingTraders.length > 0){
                                        var msg = "ID 为 "
                                        for(var i=0; i<existingTraders.length; i++){
                                            msg += existingTraders[i].traderid + " "
                                        }
                                        msg += "已加入小组！不能重复选择"
                                        csp.notify('notice', {
                                            size: 'mini',
                                            icon: false,
                                            msg: msg,
                                            delay: 15000
                                        });

                                    } else{
                                        jQuery(".js-update-view").addClass("active")
                                        updateModalState('js-team-create-page', 'hide')
                                        if(traders.length > 0){
                                                insertTeam(tname, traders, function(err, receiveData){
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        console.log("insertTeam", receiveData)
                                                        self.refreshTeam()
                                                    }
                                                })
                                            }else if(traders.length === 0){
                                                csp.notify('notice', {
                                                    size: 'mini',
                                                    icon: false,
                                                    msg: '创建小组失败，请在创建时选择交易员',
                                                    delay: 15000
                                                });
                                                self.refreshTeam()

                                            }
                                    }

                                }else{
                                     console.log("getJoinedTraders err-->",err)
                                }
                            })
                    }else{
                        csp.notify('notice', {
                            size: 'mini',
                            icon: false,
                            msg: '新建小组名称不能为空',
                            delay: 15000
                        });
                    }
}

/**
 * @func
 * @desc 确认删除
 * @author luchenqun
 */
export function delTeamConfirm() {
    var self = this
    jQuery(".js-update-view").addClass("active")

    updateModalState('js-team-del-page', 'hide')
    delTeam(curTid, function(err, receiveData){
        self.refreshTeam()
    })
}

/**
 * @func
 * @desc 确认修改
 * @author luchenqun
 */
export function modifyTeamConfirm(){
    var self = this

    var tid = parseInt(jQuery(".js-team-modify-tname").attr("tid"))
    var tname = jQuery(".js-team-modify-tname").val()
    var traders = []

    jQuery(".js-team-modify-checkbox").each(function(){
        if(jQuery(this).checkbox('is checked')){
            console.log(jQuery(this).attr("traderid"), jQuery(this).attr("trid"))
            var trader = {
                "traderid":jQuery(this).attr("traderid"),
                "trid":jQuery(this).attr("trid"),
            }
            traders.push(trader)
        }
    });

    getJoinedTraders(function(err, receiveData){
        if(!err){
            var joinedTraders = receiveData
            var existingTraders = []
            for(var i=0; i<joinedTraders.length; i++){
                for(var j=0; j<traders.length; j++){
                    if(joinedTraders[i].traderid === traders[j].traderid && joinedTraders[i].tid !== tid){
                        console.log(joinedTraders[i].traderid, traders[j].traderid, joinedTraders[i].tid, tid)
                        existingTraders.push(joinedTraders[i])
                    }
                }
            }

            if(existingTraders.length > 0){
                var msg = "ID 为 "
                for(var i=0; i<existingTraders.length; i++){
                    msg += existingTraders[i].traderid + " "
                }
                msg += "已加入小组！不能重复选择"
                csp.notify('notice', {
                    size: 'mini',
                    icon: false,
                    msg: msg,
                    delay: 15000
                });

            } else{
                updateModalState('js-team-modify-page', 'hide')
                jQuery(".js-update-view").addClass("active")
                updateTeam(tid, tname, traders, function(err, receiveData){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("updateTeam result --->", receiveData)
                        self.refreshTeam()
                    }
                })
            }

        }else{

        }
    })
}

</script>
