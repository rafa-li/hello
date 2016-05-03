/**
 * @file excel操作的一些方法;
 * @author luchenqun
 * @version 1.0
 * @copyright 2016 All Right Reserved @ LeHighHongking
 * @example
 */

 /**
 * @desc excel 数据导出
 * @author luchenqun
 * @param {Object} postman  - 导出使用的对象，后台传来
 * @param {Array} cols      - excel数据的表头数据
 * @param {Array} rows      - excel导出数据
 * @param {String} fileName - 导出文件名，如果不写，则以当前的时间（精确到秒）作为导出文件，如：201601131030。注意：不要传后缀名
 * @see {@link https://github.com/functionscope/Node-Excel-Export}
 */
exports.export = function(postman, cols, rows, fileName) {
    var nodeExcel = require('excel-export');
    var conf = { };
    conf.cols = cols
    conf.rows = rows

    var result = nodeExcel.execute(conf);

    if(typeof fileName === 'undefined'){
        fileName = new Date().format("yyyyMMddhhmmss")
    }

    postman.outputFile(result, {
        'Content-Type': 'application/vnd.openxmlformats'
        , "Content-Disposition": "attachment; filename=" + fileName + ".xlsx"
    })
}

/**
* @desc excel 数据导出
* @author luchenqun
* @param {Object} postman  - 导出使用的对象，后台传来
* @param {Array} confs      - excel数据，confs组成结构[{rows:[...], cols:[...], name:'xxx'},...] 参考单个导出。。。
* @param {String} fileName - 导出文件名，如果不写，则以当前的时间（精确到秒）作为导出文件，如：201601131030。注意：不要传后缀名
* @see {@link https://github.com/functionscope/Node-Excel-Export}
*/
exports.exportMultipleSheets = function(postman, confs, fileName) {
   var nodeExcel = require('excel-export');

   var result = nodeExcel.execute(confs);

   if(typeof fileName === 'undefined'){
       fileName = new Date().format("yyyyMMddhhmmss")
   }

   postman.outputFile(result, {
       'Content-Type': 'application/vnd.openxmlformats'
       , "Content-Disposition": "attachment; filename=" + fileName + ".xlsx"
   })
}
