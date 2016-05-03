<template >

    <div><button class="ui labeled icon button" v-on:click="test">  分页效果测试 </button></div>
    <div class="ui divider"></div>
    <span><button class="ui labeled icon button" v-on:click="showMessage1">  消息队列测试普通通知 </button></span>
    <span><button class="ui labeled icon button" v-on:click="showMessage2">  消息队列测试显示html(随机) </button></span>
    <div class="ui divider"></div>
    <div><button class="ui labeled icon button" v-on:click="connectCMS">  测试连接cms </button></div>
    <div class="ui divider"></div>
    <div><button class="ui labeled icon button" v-on:click="exportExcelMultipleSheets">导出excel(多个表格)</button></div>
    <div class="ui divider"></div>
    <div><button class="ui labeled icon button" v-on:click="exportExcel">导出excel(一个表格)</button></div>
    <div class="ui divider"></div>
    <span><widget-acid-dropdown v-ref:acid_dropdown></widget-acid-dropdown></span>
    <span><widget-trid-dropdown v-ref:trid_dropdown></widget-trid-dropdown></span>
    <span><widget-trader-dropdown v-ref:trader_dropdown></widget-trader-dropdown></span>
    <span><widget-team-dropdown v-ref:team_dropdown></widget-team-dropdown></span>
    <div class="ui divider"></div>
    <widget-pagination v-ref:pagination></widget-pagination>

</template>
<script server>
// 后端代码，在 nodejs 中执行 ----------------------------
export function runSql(postman, sql) {
    ison.db.query(sql,function(err, data){
        postman( err || data )
    })

    console.log(sql, ison.db.query(sql))
}

export function testExport(postman) {
    var cols = [
        {
            caption:'证券代码',
            type:'string',
        },
        {
            caption:'证券名称',
            type:'string',
        },
        {
            caption:'证券数量',
            type:'number',
        },
    ];

    var rows = [
      ['600446', '金正股份', parseInt(Math.random() * 1000)],
      ['000001', '酱油股份', parseInt(Math.random() * 1000)],
      ['000002', '平安股份', parseInt(Math.random() * 1000)],
    ];
    excel.export(postman, cols, rows, 'testFileName')
}

export function testExportMultipleSheets(postman, num) {
    console.log('testExportMultipleSheets num = ', num)
    var confs = [];
    for (var i=0; i<num; i++) {
        var cols = [
            {
                caption:'证券代码',
                type:'string',
            },
            {
                caption:'证券名称',
                type:'string',
            },
            {
                caption:'证券数量',
                type:'number',
            },
        ];

        var rows = [
          ['600446', '金正股份', parseInt(Math.random() * 1000)],
          ['000001', '酱油股份', parseInt(Math.random() * 1000)],
          ['000002', '平安股份', parseInt(Math.random() * 1000)],
        ];
        var conf = {};
        conf.cols = cols
        conf.rows = rows
        conf.name = 'sheet' + (i+1);

        confs.push(conf);
    }
    excel.exportMultipleSheets(postman, confs)
}

</script>



<script>
var index = 0
// 前端代码，在浏览器中执行 ----------------------------

Math.randomString = function(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

export function data(){
    return {
        "output": {}
        , "sql": ""
        , "message": "HelloWorld"
    }
}

/**
 * @func
 * @desc 初始化
 * @author luchenqun
 */
export function ready() {
    this.$refs.acid_dropdown.updateDropdownList('000006')
    this.$refs.trid_dropdown.updateDropdownList('000007')
    this.$refs.trader_dropdown.updateDropdownList('000008')
}

export var events = {
    'page-changed': function(currentPage) {
        console.log('I have receive a page_changed singal, current_page = ', currentPage)
    },
    'acid-changed': function(acid) {
        // console.log('I have receive a acid-changed singal, current_acid = ', acid)
    },
    'trid-changed': function(trid) {
        // console.log('I have receive a trid-changed singal, trid = ', trid)
    },
    'team-changed': function(tid) {
        console.log('I have receive a team-changed singal, tid = ', tid)
    },
}

export function test(){
        this.$refs.pagination.setTotalPage(parseInt(Math.random() * 50 + 1))
        this.$refs.acid_dropdown.updateDropdownList('8')
        this.$refs.team_dropdown.updateDropdownList('8')
        console.log('1', this.$refs.acid_dropdown.getCurrentSelectAcid())
        console.log('2', this.$refs.trid_dropdown.getCurrentSelectTrid())
        console.log('3', this.$refs.trader_dropdown.getCurrentSelectTrid(), '4', this.$refs.trader_dropdown.getCurrentSelectTrader())
}

export function showMessage1(){
    csp.notify('notice', {
        msg: 'CSP notice test.CSP notice test.CSP notice test.CSP notice test.CSP notice test.CSP notice test.CSP notice test.',
        delay: 150000,
    });
}
export function showMessage2(){
    var flag = (Math.random() > 0.5 ? true : false)
    csp.notify('notice', {
        remove: flag,
        html: flag,
        msg: '<button class="ui primary button">确定 </button><button class="ui button">取消 </button>',
        delay: flag ? 15000 : false,
    });
}
export function connectCMS(){
    var actor = "common/tatrd"
    var data = {maid: '000000'}
    ison.tgw.send(actor, data, function(){
        console.log(arguments)
    })
}
export function showNotice(){

}

export function run() {
    var self = this

    // 在按钮上显示 loading
    $(".js-run-sql").addClass("loading")

    // 显示遮罩层
    $(".js-output .js-dimmer").addClass("active")

    runSql(this.sql, function(err,data){

        // 等 0.5 秒钟， 让 loading 显示一会儿
        setTimeout(function(){
            // 取消按钮上的 loading
            $(".js-run-sql").removeClass("loading")

            // 取消遮罩层
            $(".js-output .js-dimmer").removeClass("active")

            if(err) {
                self.output = err
            }
            else {
                self.output = data
            }

        }, 500)
    })
}

export function exportExcelMultipleSheets(){
    console.log("exportExcelMultipleSheets...........")
    var num = parseInt(Math.random() * 10)
    testExportMultipleSheets.downloadFile(num)
}

export function exportExcel(){
    console.log("exportExcel...........")
    testExport.downloadFile()
}


</script>
