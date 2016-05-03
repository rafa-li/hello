<style type="text/css">

.TridSecuritiesTable {
    height: 100%;
    width: 100%;
    padding-top: 12px;
}

.table-container.Rd {
    margin-top: 10px;
    height: 85%;
}


.ui.tridSecurities.modal {
    width: 50%

}

.ui.editSecurities.modal{
    width: 30%


}


</style>

<template class="TridSecuritiesTable">

<div class="ui medium header">
    交易单元券表</div>
<div class="data-container">
    <widget-trid-dropdown v-ref:trid_dropdown></widget-trid-dropdown>
    <button class="ui primary button" v-on:click="importExcel" style="width:100px;margin-left:0;">导入券表 </button>
    <button class="ui primary button" v-on:click="exportExcel" style="margin-left:10px; width:100px;">导出券表 </button>
    <button class="ui button" v-on:click="refresh">刷&nbsp;新 </button>
    <div class="table-container Rd">
        <table class="ui single line selectable striped table" id="js-trid-securities-table">
            <thead id="fix-header">
                <tr>
                    <th>序号</th>
                    <th>证券代码</th>
                    <th>证券名称</th>
                    <th>数量</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in TridSecuritiesTable" id="securities">
                    <td>{{$index+1}}</td>
                    <td>{{item.code}}</td>
                    <td>{{item.cname}}</td>
                    <td>{{item.amount}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="ui inverted dimmer update-tst-view">
        <div class="ui text loader">正在解析券表，请稍后……</div>
    </div>
    <div class="ui inverted dimmer update-edit-view">
        <div class="ui text loader">正在保存修改，请稍后……</div>
    </div>
</div>
</div>

<div class="ui tridSecurities modal">
    <i class="close icon"></i>
    <div class="header">导入券表</div>
    <div class="content">
        <div class="ui equal width grid">
            <div class="row">
                <div class="six wide column">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <form method="post" enctype='multipart/form-data' action='/upload' role = "form" id = "formUploadFile">
                        <div class = "form-group">
                        <input type="file" name="uploadfile" class="uploadfile"  accept=".xls,.xlsx,.csv"/>
                        </div>
                   </form>
               </div>
               <div class="ten wide column">
                   <p>导券注意事项：</p>
                   <p>1.使用office2007及以上版本，暂不支持WPS</p>
                   <p>2.导入格式支持CSV、xls、xlsx三种格式</p>
                   <p>3.导入格式如下：</p>
                   <table class="ui fixed table">
                       <thead>
                           <tr class="center aligned">
                               <th width="33.33%">证券代码</th>
                               <th width="33.33%">证券名称</th>
                               <th width="33.33%">数量</th>
                           </tr>
                       </thead>
                       <tbody>
                           <tr class="center aligned">
                           <td>000001</td>
                           <td>平安银行</td>
                           <td>1000</td>
                       </tr>
                       <tr class="center aligned">
                           <td>&nbsp;</td>
                           <td>&nbsp;</td>
                           <td>&nbsp;</td>
                       </tr>
                       </tbody>
                   </table>
                   <br/>
               </div>
           </div>
       </div>
   </div>
   <div class="actions">
       <div class="ui cancel button">
           <i class="remove icon"></i>
           取消
       </div>
       <div class="ui green button" v-on:click="submitImport">
           <i class="checkmark icon"></i>
           确认
       </div>
   </div>

</div>
<div class="ui editSecurities modal">
    <i class="close icon"></i>
    <div class="header">修改券表数量</div>
    <div class="content">
        <div class="ui form">
            <div class="two fields inline">
                <span><h4 class="ten wide field">券表资产管理人ID</h4></span><span>{{ maid }}</span>
            </div>
            <div class="three fields inline">
             <label class="four wide field">证券代码</label> <input type="text"  placeholder={{thisCode}}  disabled >
            </div>
            <div class="three fields inline">
             <label class="four wide field">证券名称</label> <input type="text" placeholder={{thisCname}}  disabled >
            </div>
            <div class="three fields inline">
             <label class="four wide field">证券数量</label> <input type="text" id="thisAmount" v-model="thisAmount" value="{{thisAmount}}" checked >
            </div>
        </div>
   </div>
   <div class="actions">
       <div class="ui cancel button">
           <i class="remove icon"></i>
           取消修改
       </div>
       <div class="ui green button" v-on:click="submitEdit">
           <i class="checkmark icon"></i>
           确认修改
       </div>
   </div>
</div>
</template>


<script server>
var maid = ''
var trid = ''

/**
* @desc 从登录session获取oid
* @func getOid
* @author lizhexi
*/
export function getOid(postman){
    var oid = postman.req.session.oid
    postman({oid:oid});

}
/**
* @desc 获取登录者的conlevel
* @func getConlevel
* @author lizhexi
*/
export function getConlevel(postman,oid){
    var retData={
        "error":false,
        "conlevel":'',
        "cellid":'',
    }
    var conSQL = "SELECT max(conlevel) AS conlevel ,cellid FROM tsoper_conlevel WHERE "
               + "( conlevel= 2 OR conlevel =20 OR conlevel =21 OR conlevel =22) AND oid = '"
               + oid+"'";
    ison.db.query(conSQL,function(err,data){
        if(!err){
            console.log(conSQL,"------>")
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

/**
 * @desc  确保forEach函数的正常运行
 * @author lizhexi
 */
if (!Array.prototype.forEach)
{
 Array.prototype.forEach = function(fun /*, thisp*/)
 {
  var len = this.length;
  if (typeof fun != "function")
   throw new TypeError();

  var thisp = arguments[1];
  for (var i = 0; i < len; i++)
  {
   if (i in this)
    fun.call(thisp, this[i], i, this);
  }
 };
}
/**
 * @func   insertTridSecurities
 * @desc   将导入的券表数据插入数据库
 * @author lizhexi
 */
export function insertTridSecurities(valueStr,postman){
    var insSQL = 'INSERT INTO  csp_trid_securities VALUES('+valueStr+')' ;
    ison.db.query(insSQL, function(err, data) {
        console.log(insSQL, "--->", JSON.stringify(data))
        if(err){
            postman({err:err})
        }else{
            postman({data:data})
        }
    })
}
/**
 * @func   clearTable
 * @desc   清空csp_trid_securities表中对应maid的数据
 * @author lizhexi
 */
export function clearTable(postman){
    var clearSQL='DELETE FROM csp_trid_securities WHERE trid ="'+trid+'"';
    ison.db.query(clearSQL, function(err, data) {
        console.log(clearSQL, "--->", JSON.stringify(data))
        postman(err || data)
        })
}
/**
 * @func   editAmount
 * @desc   编辑券表某项数据
 * @author lizhexi
 */
export function editAmount(postman, amount,code){
    var updateSQL='UPDATE csp_trid_securities SET amount ='+ amount
                 +' WHERE trid= "'+trid+'" AND code = "'+code+'"';
    ison.db.query(updateSQL, function(err, data) {
        console.log(updateSQL, "--->", JSON.stringify(data))
             postman(err||data)
        })
}
/**
 * @func   getTridSecuritiesTable
 * @desc   获取csp_trid_securities表中数据
 * @author lizhexi
 */
export function getTridSecuritiesTable(postman,thistrid,thismaid) {

            var selSQL = 'SELECT code,cname,amount FROM csp_trid_securities WHERE trid ="'+thistrid+'"';
            maid = thismaid
            trid = thistrid
            ison.db.query(selSQL, function(err, data) {
                console.log(selSQL, "--->", JSON.stringify(data));

                postman(err || data);
            })


}
/**
 * @func   correctCode
 * @desc   修正导入证券代码
 * @author lizhexi
 */
function correctCode(num){
    var len = num.length;
    while(len < 6) {
        num = "0" + num;
        len++;
    }
    return num;

}
/**
 * @func   formatCode
 * @desc   格式化导入的证券代码\判断数量是否为正整数
 * @author lizhexi
 */
export function formatCode(tsData,postman) {
    var ret={
        "error":false,
        "tstable":[],
        "msg":'',
    }
    for(var i=0;i<tsData.length;i++){
         var thiscode = tsData[i].code.toString()
         var thisamount = tsData[i].amount.toString()
         if(/^\d+$/.test(thiscode)){    //判断代码是数字形式
             if(/^\d+$/.test(thisamount)){  //判断数量是否是正整数形式
                    if(thiscode.length<=6){
                        tsData[i].code = correctCode(thiscode)
                    }else{
                        ret.error = true
                        ret.msg ="解析失败，证券代码出错，请检查文件内容后重试"
                        console.log("err:代码超过6位判错---->",tsData[i].code)
                        postman(ret)
                        return
                    }
                }else{
                    ret.error=true
                    ret.msg ="解析失败，证券数量出错，请检查文件内容后重试"
                    postman(ret)
                    console.log("err:数量不是正整数形式,data.code--->",tsData[i].code)
                    return
                }
        }else{
            ret.error=true
            ret.msg ="解析失败，证券代码出错，请检查文件内容后重试"
            postman(ret)
            console.log("err:代码不是数字形式,data.code--->",tsData[i].code)
            return
        }
    }
    ret.tstable = tsData
    postman(ret)


}
/**
 * @func   correctCname
 * @desc   修正导入证券名称
 * @author lizhexi
 */
export function correctCname(code,postman){
    var cnameSQL = 'SELECT cname FROM tscode WHERE (tid ="3002" OR tid ="1001") AND code = "'+code + '"';
    var ret ={
        "error" : false,
        "thiscname":'',
    }
    ison.db.query(cnameSQL,function(err,data){
        //console.log("cnameSQL--->",cnameSQL)
        if(err){
            console.log("err--->",err)
            ret.error = true
        }else if(data[0] === undefined){
            ret.error = true
        }else{
            ret.thiscname = data[0].cname
        }
        postman(ret)
    })

}
/**
 * @func   formatCname
 * @desc   格式化导入的证券名称
 * @author lizhexi
 */
export function formatCname(tsData,postman){
    var ret ={
        "error" : false,
        "tsCname":[],
    }
    var m = 0
    tsData.forEach(function(rowData){
        correctCname(rowData.code,function(data){
            if(!data.error){
                rowData.cname = data.thiscname;
                m++;
                if(m === tsData.length){
                    ret.tsCname = tsData
                    postman(ret)
                    return
                }
            }else{
                ret.error = true
                postman(ret)
                console.log("err:此代码无效,data.cname-->",rowData.cname)
                return
            }
        })
    })

}
/**
 * @func   parseXls
 * @desc   解析上传的xls文件或xlsx文件
 * @author lizhexi
 * @param{string}  filepath--文件上传后的存储地址
 */
export function parseXls(filepath,postman){
    var xlsx = require('node-xlsx');
    var today = new Date().format("yyyyMMdd").toString();
    try{
        var obj = xlsx.parse(filepath); // parses a file
    }catch(e){
        console.error(e)
        var msg = '解析失败，请确认文件格式类型是否损坏后重新进行导入'
          postman({success:true,msg:msg})
         return
    }

    var xlsData = obj[0].data;
    var xdata = xlsData[0];
    if(xdata[0].match("代码")){
        if(xdata[1].match("名称")){
            if(xdata[2].match("数量")){
            xlsData.splice(0,1);
            var tsTable = []
            xlsData.forEach(function(rowData){
                    var row = {}
                    var code =  rowData[0];
                    var cname = rowData[1];
                    var amount = rowData[2];
                    row.code = code;
                    row.cname = cname;
                    row.amount = amount;
                    tsTable.push(row)
            })
            formatCode(tsTable,function(data){
                if(!data.error){
                    tsTable = data.tstable
                    formatCname(tsTable,function(data){
                        if(!data.error){
                            tsTable = data.tsCname
                               clearTable(function(data){
                                   if(!data){
                                       console.log("1")
                                       msg = '数据库操作失败，请重新导入'
                                       postman({msg:msg})
                                       return
                                   } else {
                                   }
                               });
                               for(var i=0;i <tsTable.length;i++){
                                  var tsRow = tsTable[i]
                                  var valueStr ='"'+tsRow.code+'" , "'+tsRow.cname+'",'+tsRow.amount+','+today+', "'+maid+'"'+', "'+trid+'"';
                                         insertTridSecurities(valueStr,function(data) {
                                              if(data.err){
                                                  console.log("parsexls err--->",data.err)
                                                  var msg = '解析失败，请确认文件内容、格式后重试'
                                                   postman({success:true,msg:msg})
                                                  return
                                              } else {
                                                  //console.log("parsexls data -->",data);
                                                  i++;
                                                  if(i>=tsTable.length){
                                                  var  msg = "解析成功"
                                                   postman({success:true,msg:msg})
                                                   return
                                                   }

                                              }
                                          });
                               }
                        }else{//correctCname 时用对应证券代码查不到对应证券名称
                            console.log("parsexls err--->correctCname")
                            var msg = '解析失败，请确认证券代码形式或数据是否正确'
                            postman({success:true,msg:msg})
                            return
                        }
                    })
                }else{
                    //correctcode 时证券代码位数出错或数量不是正数
                    console.log("parsexls err--->correctCode")
                    var msg = data.msg
                    postman({success:true,msg:msg})
                    return
                }
            })

                   }else{
                       var msg = '解析失败，请确认表格表头格式、文件内容后重试'
                       postman({success:true,msg:msg})
                       return
                   }
              }else{
                  var msg = '解析失败，请确认表格表头格式、文件内容后重试'
                  postman({success:true,msg:msg})
                  return
              }
        }else{
            var msg = '解析失败，请确认表格表头格式、文件内容后重试'
            postman({success:true,msg:msg})
            return
        }


}
/**
 * @func   parseCsv
 * @desc   解析上传的csv文件
 * @author lizhexi
 * @param{string}  filepath--文件上传后的存储地址
 */
export function parseCsv(filepath,postman){
    var iconv = require('iconv-lite');
    var fs = require('fs');
    var today = new Date().format("yyyyMMdd").toString();
    //读取文件，以GBK形式编码
    var fileStr = fs.readFileSync(filepath, {encoding:'binary'});
    var buf = new Buffer(fileStr, 'binary');
    var str = iconv.decode(buf, 'GBK');
    var rows =str.split("\r\n");

    //排除EXCEL保存CSV文件时最后带空字符
    for(var i=0;i<rows.length;i++){
        if(rows[i]=='')
        rows.splice(i,1);
    }
    var rData = rows[0].split(",")

    if(rData[0].match("代码")){
        if(rData[1].match("名称")){
            if(rData[2].match("数量")){
                rows.splice(0,1);
                var tsTable = [];
                  rows.forEach(function(row){
                        var rowData = row.split(",");
                        var row = {};
                        var code = rowData[0];
                        var cname =rowData[1];
                        var amount =rowData[2];
                        row.code = code;
                        row.cname = cname;
                        row.amount = amount;
                        tsTable.push(row)
                    })
                    formatCode(tsTable,function(data){
                        if(!data.error){
                            tsTable = data.tstable
                            formatCname(tsTable,function(data){
                                if(!data.error){
                                    tsTable = data.tsCname
                                       clearTable(function(data){
                                           if(!data){
                                               console.log("1")
                                               msg = '数据库操作失败，请重新导入'
                                               postman({msg:msg})
                                               return
                                           } else {
                                           }
                                       });
                                       for(var i=0;i <tsTable.length;i++){
                                          var tsRow = tsTable[i]
                                          var valueStr ='"'+tsRow.code+'" , "'+tsRow.cname+'",'+tsRow.amount+','+today+', "'+maid+'"'+', "'+trid+'"';
                                             insertTridSecurities(valueStr,function(data) {
                                                  if(data.err){
                                                      console.log("parsexls err--->",data.err)
                                                      var msg = '解析失败，请确认文件内容、格式后重试'
                                                       postman({success:true,msg:msg})
                                                      return
                                                  } else {
                                                    //  console.log("parsexls data -->",data);
                                                      i++;
                                                      if(i>=tsTable.length){
                                                       var  msg = "解析成功"
                                                       postman({success:true,msg:msg})
                                                       return
                                                       }

                                                  }
                                            });
                                       }
                                }else{//correctCname 时用对应证券代码查不到对应证券名称
                                    console.log("parsexls err--->correctCname")
                                    var msg = '解析失败，请确认证券代码形式或数据是否正确'
                                    postman({success:true,msg:msg})
                                    return
                                }
                            })
                        }else{
                            //correctcode 时证券代码位数出错或数量不是正数
                            console.log("parsexls err--->correctCode")
                            var msg = data.msg
                            postman({success:true,msg:msg})
                            return
                        }
                    })
            }else{
                var msg = '解析失败，请确认表格表头格式、文件内容后重试'
                postman({success:true,msg:msg})
                return
            }
        }else{
           var msg = '解析失败，请确认表格表头格式、文件内容后重试'
           postman({success:true,msg:msg})
           return
        }
    }else{
     var msg = '解析失败，请确认表格表头格式、文件内容后重试'
     postman({success:true,msg:msg})
     return
    }

}

/**
 * @func   clearRelatedTable
 * @desc   导入券表成功清空心愿清单、分券结果、换券
 * @author lizhexi
 * @param{Object}  file--上传的文件
 * @param{string}  b -- 文件后缀即类型名
 */
export function clearRelatedTable(){
     var option={}
     option.maid = maid
     var clearGroupWish = "DELETE FROM csp_group_wish_list WHERE trid = '"+trid+"'";
     var clearRandom = "DELETE FROM csp_random_allocated_results WHERE trid ='"+trid+"'";
     ison.db.query(clearGroupWish,function(err,data){
         if(!err){
                 console.log("clearGroupWish success")
                 ison.db.query(clearRandom,function(err,data){
                     if(!err){
                          console.log("clearGroupWish success")
                          ison.db.business.clearExchangeInfo(option,function(err,data){
                              console.log(err,data)
                          })
                     }else{
                         console.log("clearRandom err------->",err)
                     }
                 })
         }else{
             console.log("clearGroupWish err---->",err)
         }
     })
}
/**
 * @func   importStockTable
 * @desc   上传券表并解析
 * @author lizhexi
 * @param{Object}  file--上传的文件
 * @param{string}  b -- 文件后缀即类型名
 */
export function importStockTable(postman, file, a, b) {

    console.log(file, a, b)
    var filepath = "./uploadFile/"+file.filename;
    var func=function(){

    if(b ===".xls"||b === ".xlsx"){
        parseXls(filepath,function(data){
            if(data.success){
                if(data.msg === '解析成功'){
                    clearRelatedTable();
                }
                 postman({success:true,msg:data.msg});
            }
        });

   }else if(b === ".csv"){
        parseCsv(filepath,function(data){
            if(data.success){
                if(data.msg === '解析成功'){
                    clearRelatedTable();
                }
                 postman({success:true,msg:data.msg});
            }
        });
    }

 }

 func();



}
/**
* @desc 更新数据
* @author luchenqun lizhexi
* @param {Object} postman   - 推送的数据对象
* @param {Object} inPutParm - 输入的数据(即查询条件)
*/
export function saveExcelFile(postman,inPutParm){
    var selSQL = 'SELECT code,cname,amount FROM csp_trid_securities WHERE trid ='+trid;
    var today = new Date().format("yyyyMMdd").toString();
    var filename = today+"交易单元券表"
    ison.db.query(selSQL, function(err,data) {
        if(!err){
    //写入表格
             var tridSecurities = data;
                var cols = []
                var rows = []
                var titles = [
                    "证券代码","证券名称","数量"
                ]
                  //规定列数和类别
                    for(var i=0; i<titles.length; i++){
                        var item = {}
                        item.caption = titles[i];
                        item.type = 'string'
                        cols.push(item)
                    }
                    for(var i=0; i<tridSecurities.length; i++){
                        var item = []
                        item.push(tridSecurities[i].code)
                        item.push(tridSecurities[i].cname)
                        item.push(tridSecurities[i].amount)
                        rows.push(item)
                    }
                    excel.export(postman, cols, rows)

            }


    });
}
</script>


<script client>
var curTrid =''
var curConlevel = 0
/**
 * @func
 * @desc vue绑定数据
 * @author lizhexi
 */
export function data() {
    return {
        "TridSecuritiesTable":[],
        "maid":'',
        "oid":'',
        "thisCode":'',
        "thisCname":'',
        "thisAmount":'',
    }
}
/**
 * @var
 * @desc vue 事件(信号接收)
 * @author lizhexi
 */
export var  events = {
    'trid-changed': function (trid) {
        curTrid = trid
        this.refresh();
        console.log('------------>', curTrid)
    }
}
/**
 * @func   refresh
 * @desc   刷新表格页面
 * @author lizhexi
 */
export function refresh() {
   csp.fixTableHead("js-trid-securities-table", "100%", "100%")
    var self = this;
getOid(function(err,data){
    if(!err){
          self.oid = data.oid
          self.maid = data.oid.split(".")[0];
          console.log("maid--->",self.maid);
          getConlevel(self.oid,function(err,data){
              if(!data.error){
                curConlevel = data.conlevel
                if(curConlevel == 20){
                    getTridSecuritiesTable(curTrid,self.maid,function(err, receiveData){
                        if(err){
                            console.log(err);
                        }
                        else{
                        if(receiveData.length >= 0)
                        self.TridSecuritiesTable = receiveData;
                    }
                        jQuery(".update-tst-view").removeClass("active")
                        jQuery(".update-edit-view").removeClass("active")
                     });
                }else{
                    curTrid = data.cellid
                    getTridSecuritiesTable(curTrid,self.maid,function(err, receiveData){
                        if(err){
                            console.log(err);
                        }
                        else{
                        if(receiveData.length > 0)
                        self.TridSecuritiesTable = receiveData;
                    }
                        jQuery(".update-tst-view").removeClass("active")
                        jQuery(".update-edit-view").removeClass("active")

                     });
                }

            }else{
                 console.log("err--->",err);
            }
        })

    }
})

  }
 /**
  * @func submitEdit
  * @desc 保存证券修改后的数量
  * @author lizhexi
  */
export function submitEdit(){
    var self= this
    var tAmount = jQuery("#thisAmount").val()
        if(/^\d+$/.test(tAmount)){
            editAmount(tAmount,self.thisCode,function(err,data){

                if(!err){
                    jQuery('.ui.editSecurities.modal').modal('toggle');
                    jQuery(".update-edit-view").addClass("active")
                    self.refresh()
                    csp.notify('notice', {
                        msg: '修改成功',
                        delay: 15000,
                    });
                }else{
                    csp.notify('notice', {
                        msg: '保存修改失败，请重试',
                        delay: 15000,
                    });
                }
            })
        }else{
            csp.notify('notice', {
                msg: '保存修改失败，请输入正确数量格式',
                delay: 15000,
            });
        }
}

export function ready() {
     var self = this
     console.log("--------------->TridSecuritiesTable ready");
     self.refresh();
     getOid(function(err,data){
         if(!err){
             self.oid = data.oid;
             self.maid = data.oid.split(".")[0];
             console.log("maid--->",self.maid);
             getConlevel(self.oid,function(err,data){
                 if(!data.error){
                     curConlevel = data.conlevel
                     if(curConlevel == 20){
                         curMaid = data.cellid
                         console.log("curMaid--->",curMaid);
                         self.$refs.trid_dropdown.updateDropdownList(curMaid)
                     }else{
                         curTrid = data.cellid
                         self.$refs.trid_dropdown.updateTrid(curTrid)
                     }
                 }else{
                     console.log("err--->",err);
                 }
             })
         }
     })
     document.ondblclick = function(event){
         //兼顾IE 火狐
         var event =  event || window.event
         var obj = event.srcElement ? event.srcElement:event.target;
         if (obj.parentNode.id == "securities"){
             jQuery('.ui.editSecurities.modal').modal('toggle');
             var tr = obj.parentNode;
             var tds = tr.cells
             self.thisCode = tds[1].innerText;
             self.thisCname = tds[2].innerText;
             self.thisAmount = tds[3].innerText;
         }
     }
     jQuery(window).resize(function(){
         csp.fixTableHead("js-trid-securities-table", "100%", "100%")
     });
}



export function importExcel() {

    jQuery('.ui.tridSecurities.modal').modal('toggle');
    var file = jQuery('.uploadfile') ;
    file.after(file.clone().val(""));
    file.remove();


}
/**
 * @func   submitImport
 * @desc   提交上传券表
 * @author lizhexi
 */
export function submitImport(events) {
    var self = this
    var $file = jQuery(".uploadfile");
    var filepath = getPath($file);
    var filextension = filepath.substring(filepath.lastIndexOf("."), filepath.length);
    filextension = filextension.toLowerCase();
    if ((filextension != ".csv") && (filextension != ".xls")&&(filextension != ".xlsx")){
        return    csp.notify('notice', {
            msg: '请选择正确文档格式：.csv/.xls/.xlsx',
            delay: 15000,
        });
    }else{
        jQuery('.ui.tridSecurities.modal').modal('toggle');
        jQuery(".update-tst-view").addClass("active")
    }

    importStockTable($file, 123, filextension, function(err,data){
            console.log(arguments);
         if(data.success){
             self.refresh();
             csp.notify('notice', {
                msg: data.msg,
                delay: 15000,
            });

        }else{
            console.log("上传失败")
        }

    })



}

/**
 * @func
 * @desc 兼容IE/Firefox/chrome浏览器来判断文件地址
 * @author lizhexi
 */
function getPath(obj) {
    if (obj) {
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select();
            return document.selection.createRange().text;
        } else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
            if (obj.files) {
                return window.URL.createObjectURL(obj.files[0]);
            }
            return obj.val();
        } else if (window.navigator.userAgent.indexOf("Chrome") > 0) {
            if (obj.files) {
                return window.URL.createObjectURL(obj.files[0]);
            }
            return obj.val();
        }
        return obj.val();
    }
}
/**
* @desc 导出数据为excel文件
* @author luchenqun
*/
export function exportExcel(){

        saveExcelFile.downloadFile(1)
        csp.notify('notice', {
            msg: '正在导出数据到excel文件，请稍后......',
        });

}
</script>
