//cancelExchange
//stat 0->1,1-0  |1->2|  2->3,3->2   
module.exports = function(req,res){
    Step.Step(function(){
        var that = this
        var sql = "SELECT * FROM `csp_exchange_list` WHERE tid = '"+req.tid+"' AND CODE = '"+req.code+"'"
        ison.db.query(sql,function(err,data){
            if(err){
                console.log(sql,err)
                that.end('数据库错误2.0')
            }else{
                if(data[0]){
                    req.stat = data[0].stat - 1
                    that.step()
                }else{
                    that.end('未找到数据')
                }
            }
            
        })
    },function(){
        var that = this
        ison.db.query('UPDATE `csp_exchange_list` SET stat = "'+req.stat+'",expect_exchange_time = "'+new Date().format('YYYY-MM-dd hh:mm:ss')+'" WHERE tid = '+req.tid+' AND CODE = "'+req.code+'"',function(err,data){
            if(err){
                console.log(sql,err)
                that.end('数据库错误2.1')
            }else{
                that.step()
            }
        })
    },function(){
        var that = this
        var sql = "UPDATE `csp_asked_change_list` SET stat = 5 WHERE stat = 1 AND asked_tid = '"+req.tid+"' AND asked_code = '"+req.code+"'"
        ison.db.query(sql,function(err,data){
            if(err){
                console.log(sql,err)
                that.end('数据库错误2.2')
            }else{
                that.step()
            }
        })
    },function(err){
        if(!err){
            res.send(req)
        }else{
            res.err(err)
        }
    })
}