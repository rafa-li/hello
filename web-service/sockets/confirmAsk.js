//confirmAsk
module.exports = function(req,res){
    var now_time = new Date().format('YYYY-MM-dd hh:mm:ss')
    var result = {}
    var codes = {}
    var bp_info = {}
    var value_info = {}
    var new_date = new Date().format('YYYY-MM-dd hh:mm:ss')
    console.log(req)
    Step.Step(function(){
        //查bp
        var that = this
        var sql = "SELECT SUM(t.bp) AS bp,m.tid FROM `csp_team_member` AS m LEFT JOIN `tstrader` AS t ON m.traderid = t.traderid AND m.trid = t.trid WHERE m.tid = "+req.ask_tid+" OR m.tid="+req.asked_tid+"  GROUP BY m.tid"
        ison.db.query(sql,function(err,data){
            if(err){
                that.end('数据库错误4.5')
            }else{
                for(var i=0,len=data.length;i<len;i++){
                    var item = data[i]
                    bp_info[item.tid] = item
                }
                that.step()
            }
        })
    },function(){
        var that = this
        //查双方市值
        var sql = "SELECT ROUND(SUM(c.preclose*e.post_allocated_amount),2) AS post_exchange_value,e.tid,MAX(cindex) AS cindex FROM `csp_exchange_list` AS e LEFT JOIN tscode AS c ON e.code = c.code WHERE (c.tid = '1001' OR c.tid='3002') AND (e.tid ="+req.ask_tid+" OR e.tid = "+req.asked_tid+") GROUP BY e.tid"
        ison.db.query(sql,function(err,data){
            if(err){
                that.end('数据库错误4.6')
            }else{
                for(var i=0,len=data.length;i<len;i++){
                    var item = data[i]
                    value_info[item.tid] = item
                }
                that.step()
            }
        })
    },function(){
        //查preclose
        var that = this
        ison.db.find('tscode', '', {
        	or1 : [{
        			code : req.ask_code
        		}, {
        			code : req.asked_code
        		}
        	],
        	or2 : [{
        			tid : 1001
        		}, {
        			tid : 3002
        		}
        	]
        }, function (err, data) {
        	if (err) {
        		that.end('数据库错误4.0')
        	} else {
                for(var i=0,len=data.length;i<len;i++){
        			var item = data[i]
                    codes[item.code] = item
                }
                that.step()
        	}
        })
    },function(){
        //查双方股票信息
        var that = this
        ison.db.find('csp_exchange_list', '', {
        	or1 : [{
        			tid : req.ask_tid
        		}, {
        			tid : req.asked_tid
        		}
        	],
        	or2 : [{
        			code : req.ask_code
        		}, {
        			code : req.asked_code
        		}
        	]
        }, function (err, data) {
        	if (err) {
        		that.end('数据库错误4.1')
        	} else {
                //处理信息
        		var option = process_data(data);
                var msg = option.checked()
                if(msg){
                    that.end(msg)
                }else{
                    option.create_insert_data()
                    //that.end()
                    //return
                    that.step()
                }
        	}
        })
    },function(){
        //更新双发股票信息
        var that = this
        update_db_data(function(err,data){
            if(err){
                that.end(err)
            }else{
                that.step()
            }
            
        })
    },function(){
        //更新请求状态  ->  确认
        var that = this
        ison.db.update('csp_asked_change_list', {
            stat : 2,
        }, {
            id : req.id,
        }, function (err,data) {
            if(err){
                that.end('数据库错误4.3')
            }else{
                that.step()
            }
        })
    },function(){
        //更新其他请求状态  系统拒绝
        var that = this
        ison.db.update('csp_asked_change_list', {
        	stat : 5,
        }, {
        	stat : 1,
        	or : [{
        			asked_tid : req.ask_tid,
        			asked_code : req.ask_code
        		}, {
        			asked_tid : req.ask_tid,
        			asked_code : req.asked_code
        		}, {
        			asked_tid : req.asked_tid,
        			asked_code : req.ask_code
        		}, {
        			asked_tid : req.asked_tid,
        			asked_code : req.asked_code
        		}
        	]
        }, function (err, data) {
        	if (err) {
        		that.end('数据库错误4.4')
        	} else {
        		that.step()
        	}
        })
    },function(err){
        if(err){
            res.err(err)
        }else{
            res.send(result)
        }
    })
    
    function update_db_data(cb){
        var all_count = Object.keys(result).length
        var count = 0
        var errs = []
        for(var o in result){
            var item = result[o]
            if(item.option == 'insert'){
                ison.db.insert('csp_exchange_list', {
                    tid : item.tid,
                    cindex : item.cindex,
                    code : item.code,
                    cname : item.cname,
                    post_allocated_amount : item.post_allocated_amount,
                    post_exchange_amount : item.post_exchange_amount,
                    stat : item.stat,
                    expect_exchange_time:item.expect_exchange_time,
                    exchange_time:item.exchange_time,
                }, function (err, data) {
                    this_end(err,data)
                })
            }else{
                ison.db.update('csp_exchange_list', {
                    stat : item.stat,
                    post_exchange_amount : item.post_exchange_amount,
                    exchange_time : item.exchange_time
                }, {
                    tid : item.tid,
                    code : item.code
                }, function (err,data) {
                    this_end(err,data)
                })
            }
        }
        function this_end(err,data){
            count++
            if(err){
                errs.push(err)
            }
            if(count == all_count){
                if(errs.length){
                    cb('数据库错误4.2')
                }else{
                    cb()
                }
            }
        }
    }
    
    function process_data(data){
        for(var i=0,len=data.length;i<len;i++){
            var item = data[i]
            item.exchange_time = new_date
            item.post_allocated_value = codes[item.code].preclose*item.post_allocated_amount
            item.post_exchange_value = codes[item.code].preclose*item.post_exchange_amount
            result[get_temp_key(item.tid,item.code)] = item
        }
        var ask_key = req.ask_tid+'||'+req.ask_code
        var asked_key = req.asked_tid+'||'+req.asked_code
        var ask_expect_key = req.ask_tid+'||'+req.asked_code
        var asked_expect_key = req.asked_tid+'||'+req.ask_code
        
        var option = {
            checked:function(){
                //检查数量
                var msg = checked_volume(asked_key,'asked_volume')
                if(msg){
                    return '已方'+msg
                }
                var msg = checked_volume(ask_key,'ask_volume')
                if(msg){
                    return '对方'+msg
                }
                //检查bp
                var msg = checked_bp('asked','ask')
                if(msg){
                    return '已方'+msg
                }
                var msg = checked_bp('ask','asked')
                if(msg){
                    return '对方'+msg
                }
            },
            //生成新数据
            create_insert_data:function(){
                if(!result[ask_expect_key]){
                    result[ask_expect_key] = {
                        tid:req.ask_tid,
                        cindex:++value_info[req.ask_tid].cindex,
                        code:req.asked_code,
                        preclose:codes[req.asked_code].preclose,
                        cname:req.asked_cname,
                        tname:req.asked_tname,
                        post_allocated_amount:0,
                        post_allocated_value:0,
                        post_exchange_amount:0,
                        post_exchange_value:0,
                        expect_exchange_time:new_date,
                        exchange_time:new_date,
                        option:'insert',
                    }
                }
                if(!result[asked_expect_key]){
                    result[asked_expect_key] = {
                        tid:req.asked_tid,
                        cindex:++value_info[req.asked_tid].cindex,
                        code:req.ask_code,
                        preclose:codes[req.ask_code].preclose,
                        cname:req.ask_cname,
                        tname:req.ask_tname,
                        post_allocated_amount:0,
                        post_allocated_value:0,
                        post_exchange_amount:0,
                        post_exchange_value:0,
                        expect_exchange_time:new_date,
                        exchange_time:new_date,
                        option:'insert',
                    }
                }
                process_volume(result[ask_key],'ask','sub')
                process_volume(result[ask_expect_key],'asked','add')
     
                process_volume(result[asked_key],'asked','sub')
                process_volume(result[asked_expect_key],'ask','add')
            }
        }
        return option
    }
    function checked_volume(key,type){
        if(!result[key]){
            return '股不存在';
        }
        if(!(result[key].post_exchange_amount >= +req[type])){
            return '数量不足';
        }
        return false
    }
    function checked_bp(self_type,target_type){
        var value = value_info[req[self_type+'_tid']].post_exchange_value
        var bp = bp_info[req[self_type+'_tid']].bp
        if(value - codes[req[self_type+'_code']].preclose * req[self_type+'_volume'] +  codes[req[target_type+'_code']].preclose * req[target_type+'_volume'] > bp){
            return '超bp'
        }
    }
    
    function process_volume(item,type,operator){
        var volmue = +req[type+'_volume']
        var code = req[type+'_code']
        var value = volmue*codes[code].preclose
        
        if(operator == 'add'){
            item.post_exchange_amount = +item.post_exchange_amount+(+volmue)
            item.post_exchange_value = Math.round(+item.post_exchange_value+item.post_exchange_value+(value),2)
        }else if(operator == 'sub'){
            item.post_exchange_amount -= volmue
            item.post_exchange_value = Math.round(item.post_exchange_value-value,2)
        }
        item.exchange_time = new_date
        item.stat = 2
    }
}
function get_temp_key(tid,code){
    return tid+'||'+code
}
/*
//主动方
{
    'tid||code':{
        tid:'',
        code:'',
        post_allocated_amount:0,
        post_exchange_amount:0,
        stat:2,
        option:'uodate'//insert
    }
}


ask_code

ask_volume 交换数量
ask_value   

ask_exchange_hold_volume  库存
ask_exchange_hold_value   

ask_expect_hold_last_volume 库存
ask_expect_hold_last_value

ask_expect_code

//被动方
asked_code

asked_volume 
asked_value

asked_exchange_hold_volume  库存
asked_exchange_hold_value   

asked_expect_hold_last_volume 库存
asked_expect_hold_last_value

asked_expect_code

*/
