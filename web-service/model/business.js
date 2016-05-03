/**
 * @file 数据库业务相关
 * @author zf
 * @version 1.0
 * @copyright 2016 All Right Reserved @ LeHighHongking
 */
var business = {}
/**
 * @func clearExchangeInfo
 * @author zf
 * @desc 清空换券相关信息表
 * @param options 对象 {maid:maid} or {trid:trid} or {all:true} 返回值 {err,data}
 */
business.clearExchangeInfo = function(options,cb){
    var tids = []
    select_tid()
    function select_tid(){
        var sql = ''
        if(options.maid){
            sql = "SELECT tid FROM `csp_team_member` WHERE traderid LIKE '"+options.maid+".%'"
        }else if(options.trid){
            sql = "SELECT tid FROM `csp_team_member` WHERE trid = '"+options.trid+"'"
        }else if(options.all){
            sql = "SELECT tid FROM `csp_team_member`"
        }
        ison.db.query(sql,function(err,data){
            if(err){
                cb(err,data)
            }else{
                if(data.length){
                    for(var i=0,len=data.length;i<len;i++){
                        var item = data[i]
                        tids.push(item.tid)
                    }
                    delete_exchange()
                }else{
                    cb(null,'success')
                }
            }
        })
    }
    function delete_exchange(){
        var sql = "DELETE  FROM `csp_exchange_list` WHERE tid IN " +ison.db.escape_insert_values(tids)
        ison.db.query(sql,function(err,data){
            if(err){
                cb(err,data)
            }else{
                delete_ask()
            }
        })
    }
    function delete_ask(){
        var sql = "DELETE FROM `csp_asked_change_list` WHERE ask_tid IN "+ison.db.escape_insert_values(tids)+" OR asked_tid IN " + ison.db.escape_insert_values(tids)
        ison.db.query(sql,function(err,data){
            if(err){
                cb(err,data)
            }else{
                cb(null,'success')
            }
        })
    }

}
module.exports = business
