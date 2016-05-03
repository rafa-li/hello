##表头固定使用方法##

 1. 在原始表格里面设置一个表格的id, 如：<table id="js-taact-stock-detail-table" class="ui single line selectable striped table"> ....</table>
 2. 在更新数据的地方，使用 csp.fixTableHead("js-taact-stock-detail-table", "100%", "100%")， 第一个参数为表格的id, 第二个三个参数为表格的宽度与高度，可以使用百分比，也可以使用px, 如csp.fixTableHead("js-taact-stock-detail-table", "400px", "275px")
 3. 在表格窗口改变的地方，需要重新调用 csp.fixTableHead 函数重新固定表格。如：
 jQuery(window).resize(function(){
     csp.fixTableHead("js-taact-stock-detail-table", "100%", "100%")
 });
4. 参考资料：http://www.cnblogs.com/sorex/archive/2011/06/30/2093499.html
5. 依赖文件：public\lib\csp.js
