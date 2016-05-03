//expectExchange
//stat 0->1,1-0  |1->2|  2->3,3->2  
module.exports = function(req,res){
    Step.Step(function(){
        var that = this
        ison.db.find('csp_exchange_list','',{tid:req.tid,code:req.code},function(err,data){
            if(err){
                console.log(err)
                that.end('数据库错误1.0')
            }else{
                if(data[0]){
                    req.stat = +(data[0].stat) + 1
                    that.step()
                }else{
                    that.end('未找到数据')
                }
            }
        })
    },function(){
        var that = this
        //var sql = 'UPDATE `csp_exchange_list` SET stat = "'+req.stat+'",expect_exchange_time = "'+new Date().format('YYYY-MM-dd hh:mm:ss')+'" WHERE tid = '+req.tid+' AND CODE = "'+req.code+'"'
        ison.db.update('csp_exchange_list',{stat:req.stat,expect_exchange_time:new Date().format('YYYY-MM-dd hh:mm:ss')},{tid:req.tid,code:req.code},function(err,data){
            if(err){
                console.log(err)
                that.end('数据库错误2.1')
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