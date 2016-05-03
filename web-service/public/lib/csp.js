csp = csp || {}
csp.PAGE_COUNT = 15     // 分页每页显示的数目
/**
* @desc 表格头部固定
* @author luchenqun
* @param {String} tableId - 表格的id
* @param {String} width   - 宽度 可为像素，也可为百分比，如"100px"; "90%"
* @param {String} height  - 宽度 可为像素，也可为百分比，如"100px"; "90%"
* @desc 有两点要注意：1、原始表格数据变化，都需要调用该函数，浏览器窗口大小改变，也需要调用该函数。
* @example csp.fixTableHead("MyTable", "100%", "100%")；
*   jQuery(window).resize(function(){
        csp.fixTableHead("MyTable", "100%", "100%")
    });
* @see http://www.cnblogs.com/sorex/archive/2011/06/30/2093499.html
*/
csp.fixTableHead = function(tableId, width, height) {
    // 表格数据还没有到，宽度没确定，延时设置
    setTimeout(function(){
        if (jQuery("#" + tableId + "_tableLayout").length !== 0) {
            jQuery("#" + tableId + "_tableLayout").before(jQuery("#" + tableId));   // 在所有段落之前插入一些HTML标记代码
            jQuery("#" + tableId + "_tableLayout").empty();
        } else {
            jQuery("#" + tableId).after("<div id='" + tableId + "_tableLayout' style='overflow:hidden; height:100%; width:100%;'></div>");
        }

        // 把所有匹配的元素追加到另一个指定的元素元素集合中(里面)
        jQuery('<div id="' + tableId + '_tableFix"></div>' +
                '<div id="' + tableId + '_tableHead"></div>' +
                '<div id="' + tableId + '_tableData"></div>')
                .appendTo("#" + tableId + "_tableLayout");

        // 最原始的表格
        var originalTable = jQuery("#" + tableId);

        // 固定
        var tableFixClone = originalTable.clone(true);
        tableFixClone.attr("id", tableId + "_tableFixClone");
        jQuery("#" + tableId + "_tableFix").append(tableFixClone);

        // 头部
        var tableHeadClone = originalTable.clone(true);
        tableHeadClone.attr("id", tableId + "_tableHeadClone");
        jQuery("#" + tableId + "_tableHead").append(tableHeadClone);

        // 数据
        jQuery("#" + tableId + "_tableData").append(originalTable);

        // 布局里面的所有表格 margin 设为 0
        jQuery("#" + tableId + "_tableLayout table").each(function() {
            jQuery(this).css("margin", "0");
        });

        var HeadHeight = jQuery("#" + tableId + "_tableHead thead").height() + 2;
        jQuery("#" + tableId + "_tableHead").css("height", HeadHeight);
        jQuery("#" + tableId + "_tableFix").css("height", HeadHeight);

        jQuery("#" + tableId + "_tableFix").css("width", 2);
        jQuery("#" + tableId + "_tableData").scroll(function() {
            jQuery("#" + tableId + "_tableHead").scrollLeft(jQuery("#" + tableId + "_tableData").scrollLeft());
        });

        jQuery("#" + tableId + "_tableFix").css({
            "overflow": "hidden",
            "position": "relative",
            "z-index": "20",
            "background-color": "Silver"
        });

        jQuery("#" + tableId + "_tableHead").css({
            "overflow": "hidden",
            "width": "100%",
            "position": "relative",
            "z-index": "15",
            "background-color": "#FFFFFF"
        });

        jQuery("#" + tableId + "_tableData").css({
            "overflow": "auto",
            "width": width,
            "height": height,
            "position": "relative",
            "z-index": "5"
        });

        // if (jQuery("#" + tableId + "_tableHead").width() > jQuery("#" + tableId + "_tableFix table").width()) {
        //     console.log('---------------------------->', jQuery("#" + tableId + "_tableHead").width() , jQuery("#" + tableId + "_tableFix table").width())
        //     jQuery("#" + tableId + "_tableHead").css("width", jQuery("#" + tableId + "_tableFix table").width());
        //     jQuery("#" + tableId + "_tableData").css("width", jQuery("#" + tableId + "_tableFix table").width() + 17);
        // }

        jQuery("#" + tableId + "_tableFix").offset(jQuery("#" + tableId + "_tableLayout").offset());
        jQuery("#" + tableId + "_tableHead").offset(jQuery("#" + tableId + "_tableLayout").offset());
        jQuery("#" + tableId + "_tableData").offset(jQuery("#" + tableId + "_tableLayout").offset());
    }, 100)
}
