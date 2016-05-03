<template style="position:absolute; height: 100%; width: 100%">

    <div class="js-top-bar" >
        <div class="topbar" style="position:fixed;">
            <div class="icon-box">
                <div class="ui dropdown user">
                    <input type="hidden" name="above-date">
                    <i class="small dropdown icon"></i>
                    <div class="text">资产管理人</div>

                    <div class="menu">
                        <div class="item" data-value="0">全局管理人</div>
                        <div class="item" data-value="1">资产管理人</div>
                        <div class="item" data-value="2">交易员管理人</div>
                        <div class="item" data-value="3">交易员</div>
                        <div class="item" data-value="4">朱江华管理人</div>
                        <div class="item" data-value="5">卢郴群管理人</div>
                    </div>
                </div>
                <i class="user icon"></i>
            </div>
        </div>
        <!-- <h3 center>ISON 客户自助平台</h3> -->
    </div>

    <div class="js-mainview-outer">
        <component :is="currentView"></component>
    </div>

    <!-- 左侧主菜单 -->
    <app-side-menu v-ref:sidemenu wait-for="data-loaded" style="position: fixed;z-index: 140;"></app-side-menu>

</template>

<style>

.js-mainview-outer{
    margin: 0 25px;
    padding: 0;
    height: 94%;
    padding-top: 47px;
}
.ui.circular.button{
    z-index: 150;
}
.js-top-bar .topbar{
    position: fixed;
    z-index: 135;
}
.js-top-bar .icon{
    font-size: 22px;
    opacity: 0.8;
    float: right;
    margin: auto 0;
    margin-left: 40px;
    margin-right: 8px;
}
.icon-box{
    vertical-align: middle;
    height: 26px;
    width: 280px;
    position: fixed;
    right: 25px;
    top: 10px;
}
.js-top-bar .text{
    float: right;
    font: normal 14px 'Microsoft YaHei';
    color: #323333;
}
.js-top-bar .icon-box .dropdown.icon{
    float: right;
    margin:5px 0 10px 5px;
}
.js-top-bar .ui.dropdown.user{
    float: right;
    vertical-align: middle;
    margin-right: 10px;
}
.alarm.outline.icon a{
    color: #db2828;
    font-family: Arial;
    font-size: 12px;
    position: absolute;
    margin-left: -6px;
    margin-top: -6px;
}
</style>


<script>
export function ready() {
    jQuery('.ui.dropdown.user')
      .dropdown();
}

export function registerSideMenu(sideMenu) {

    /** 单元管理 菜单注册 */
    sideMenu.registerItem(
        "/unit_manage", {
            title: "单元管理",
            icon: "database icon",
        }
    )
    sideMenu.registerItem(
        "/unit_manage/TridTraderStockTable", {
            title: "&nbsp&nbsp·&nbsp交易小组管理",
            component: "unit_manage/TradeTeamManage.vue",
            click: function() {
                console.log("交易小组管理")
            }
        }
    )
    sideMenu.registerItem(
            "/unit_manage/TridSecuritiesTable", {
                title: "&nbsp&nbsp·&nbsp交易单元券表" ,
                component: "unit_manage/TridSecuritiesTable.vue",
                click: function() {
                    console.log("交易单元券表")
            }
        }
    )

    /** 视图管理 菜单注册 */
    sideMenu.registerItem(
        "/view_manage", {
            title: "视图管理",
            icon: "unhide icon",
        }
    )

    sideMenu.registerItem(
        "/view_manage/TaactTradeDetail", {
            title: "&nbsp&nbsp·&nbsp资产账户交易明细查询",
            component: "view_manage/TaactTradeDetail.vue",
            click: function() {
                console.log("资产账户查询及报表", "view_manage/.vue")
            }
        }
    )

    sideMenu.registerItem(
        "/view_manage/TaactStockDetail", {
            title: "&nbsp&nbsp·&nbsp资产账户股票汇总表",
            component: "view_manage/TaactStockDetail.vue",
            click: function() {
                console.log("资产账户股票汇总表")
            }
        }
    )

    sideMenu.registerItem(
        "/view_manage/TridTradeTable", {
            title: "&nbsp&nbsp·&nbsp交易单元交易明细表",
            component: "view_manage/TridTradeTable.vue",
            click: function() {
                console.log("交易单元交易明细表")
            }
        }
    )

    sideMenu.registerItem(
        "/view_manage/TridStockTable", {
            title: "&nbsp&nbsp·&nbsp交易单元股票汇总表",
            component: "view_manage/TridStockTable.vue",
            click: function() {
                console.log("交易单元股票汇总表")
            }
        }
    )


    sideMenu.registerItem(
        "/view_manage/TridTraderTable", {
            title: "&nbsp&nbsp·&nbsp交易单元交易员汇总表",
            component: "view_manage/TridTraderTable.vue",
            click: function() {
                console.log("交易单元交易员汇总表(TDR003)")
            }
        }
    )

    sideMenu.registerItem(
        "/view_manage/TridTraderStockTable", {
            title: "&nbsp&nbsp·&nbsp交易单元交易员股票汇总表",
            component: "view_manage/TridTraderStockTable.vue",
            click: function() {
                console.log("交易单元交易员股票汇总表(TDR004)")
            }
        }
    )

    sideMenu.registerItem(
        "/view_manage/TridHistoryTable", {
            title: "&nbsp&nbsp·&nbsp交易单元历史结算表",
            component: "view_manage/TridHistoryTable.vue",
            click: function() {
                console.log("交易单元历史结算表")
            }
        }
    )

    /** 自助分券管理 菜单注册 */
    sideMenu.registerItem(
        "/allocate_stock_manage", {
            title: "自助分券管理",
            icon: "block layout icon",
        }
    )

    sideMenu.registerItem(
        "/allocate_stock_manage/GroupWishList", {
            title: "&nbsp&nbsp·&nbsp小组心愿清单",
            component: "allocate_stock_manage/GroupWishList.vue",
            click: function() {
                console.log("小组心愿清单")
            }
        }
    )


    sideMenu.registerItem(
        "/allocate_stock_manage/Random", {
            title: "&nbsp&nbsp·&nbsp随机分券",
            component: "allocate_stock_manage/Random.vue",
            click: function() {
                console.log("随机分券")
            }
        }
    )

    sideMenu.registerItem(
        "/allocate_stock_manage/Exchange", {
            title: "&nbsp&nbsp·&nbsp小组换券",
            component: "allocate_stock_manage/Exchange.vue",
            click: function() {
                console.log("小组换券")
            }
        }
    )


    sideMenu.registerItem(
        "/demo"
        , {
            title: "Demo" ,
            icon: "wizard" ,
            component: "demo/FirstPage.vue"
        }
    )

}

// 定义数据
export function data(){
    return {
        currentView: null
    }
}

// 事件
export var events = {

    // 主试图区 切换到某个组建
    'active-component': function(component){

        console.log("to:",component)
        this.currentView = window.app.transeComponentName(component)

        jQuery.anchor("loop-once")
    }
}


export function sideMenu() {
    return this.$refs["sidemenu"]
}
</script>
