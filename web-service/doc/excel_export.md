## excel数据导出使用方法##

 1. 首先请在前台写一个出发导出操作的函数，假设为exportExcel，如下：
 export function exportExcel(){
}
 2. 在后台写一个导出函数，假设为saveExcelFile()，如下：
export function saveExcelFile(postman, inPutParm){
}
3、在前台使用downloadFile调用后台的saveExcelFile函数。如下：
export function exportExcel(){
    var sendData = {aa:xxx, bb:yyy, cc:zz......}
    saveExcelFile.downloadFile(sendData)
}
 4. 后台接收到前台发送过来的数据之后，生成需要保存的excel数据。excel需要的数据有标题跟数据。然后调用 excel.export(postman, cols, rows, fileName)会自动生成excel文件。其中fileName如果不传，将自动生成一个以yyyyMMddhhmmss格式的excel文件。传文件名不需要传文件后缀。示例如下：
export function saveExcelFile(postman, inPutParm){
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
      ['600446', '金正股份', 100],
      ['000001', '酱油股份', 300],
      ['000002', '平安股份', 200],
    ];
    excel.export(postman, cols, rows)
}
5. 参考资料：https://github.com/functionscope/Node-Excel-Export
6. 依赖文件：mvc\common\excel.js
