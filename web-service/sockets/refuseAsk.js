//refuseAsk
module.exports = function(req,res){
    var now_time = new Date().format('YYYY-MM-dd hh:mm:ss')
    req.update_time = now_time
    ison.db.query("UPDATE `csp_asked_change_list` SET stat =  '3',update_time = '"+now_time+"' WHERE id =  '"+req.id+"'",function(err,data){
        if(!err){
            res.send(req)
        }else{
            res.err('数据库错误5.0')
            console.log(err)
        }
    })
}