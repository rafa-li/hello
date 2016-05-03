//askExchange
module.exports = function(req,res){
    req.ask_time = new Date().format('YYYY-MM-dd hh:mm:ss')
    req.id = Date.now()*1000+Math.floor(Math.random()*1000)
    Step.Step(function(){
        var that = this
        var sql = "INSERT INTO `csp_asked_change_list` (`id`,`ask_tid`,`ask_code`,`ask_cname`,`ask_volume`,`ask_value`,`asked_tid`,`asked_code`,`asked_cname`,`asked_volume`,`asked_value`,`ask_time`,`stat`) VALUES ("
        
        sql += "'"+req.id+"',"
        sql += "'"+req.ask_tid+"',"
        sql += "'"+req.ask_code+"',"
        sql += "'"+req.ask_cname+"',"
        sql += "'"+req.ask_volume+"',"
        sql += "'"+req.ask_value+"',"
        sql += "'"+req.asked_tid+"',"
        sql += "'"+req.asked_code+"',"
        sql += "'"+req.asked_cname+"',"
        sql += "'"+req.asked_volume+"',"
        sql += "'"+req.asked_value+"',"
        sql += "'"+req.ask_time+"',"
        sql += "'1')" 
        
        ison.db.query(sql,function(err,data){
            if(!err){
                that.step()
                return
            }else{
                console.log(err,sql)
                that.end('数据库错误3.0')
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