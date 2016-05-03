<template class="login" lfttop=window,30 rgtbtm=window,-30 >
  <div class="form_box">
    <h1>CSP</h1>
    <h2>Version&nbsp;&nbsp;1.0</h2>
    <form class="ui form login_container">
        <div class="field">
          <input type="text" v-model="maid" id="maid"placeholder="资产管理人">
        </div>
      <div class="field">
        <input type="text" v-model="username" id="username" placeholder="用户名">
      </div>
      <div class="field">
        <input type="password" v-model="password" id="password" placeholder="密码">
      </div>
      <div class="field">
        <div class="ui log checkbox">
          <input type="checkbox" >
          <label>保存登录信息</label>
        </div>
      </div>
      <button class="ui fluid button" type="button" @click="onsubmit">登&nbsp;录</button>
    </form>
  </div>
</template>

<style type="text/css">
  .login{
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url(images/Login_BG.png) no-repeat;
    background-size: 100% 100%;

  }
  .form_box{
    width:354px;
    height: 412px;
    border-radius:8px;
    background-color:rgba(255,255,255,.6);
    margin: 0 auto;
    position: relative;
    top: 50%;
    margin-top: -206px;
    padding-top: 54px;
  }
  .form_box h1{
    font: 33px arial,sans-serif;
    color:#009cff;
    margin-left: 44px;
    margin-bottom: 0px;

  }
  .form_box h2{
    font: 18px calibri,sans-serif;
    color: #7d8d98;
    margin-top: 6px;
    margin-bottom: 18px;
    margin-left: 44px;
  }

  .login_container{
    width:264px !important;
    height: 200px !important;
    margin:0 auto !important;
   }   
   
   .ui.fluid.button{
    display: block;
    padding: 0 !important;
    margin: 0 !important;
    text-align: center !important;
    background-color: #009dfe ;
    line-height: 34px;
    height: 34px;
    font: 14px 'Microsoft YaHei';
    color: #edf8ff;
   }
</style>

<script server>
export function login(postman, maid , username, password,remember) {
    var oid = maid+"."+username;
  if( process.argv.includes("--dev")){

      if(remember){
          postman.req.session.oid = oid;
          postman.req.session.maid=maid;
          postman.req.session.username=username;
          postman.req.session.password=password;
          postman.req.session.cookie.originalMaxAge = 1000*60*60*24*7;
      }else{
         postman.req.session.oid = oid;
          postman.req.session.maid=maid;
          postman.req.session.username= null;
          postman.req.session.password= null;
          postman.req.session.cookie.originalMaxAge = null
      }
      postman({success:true})
  }else{
            ison.tgw.login(maid,oid,password,99,function(err,data){
                 if(!err){
                   if(remember){
                       postman.req.session.oid = oid;
                       postman.req.session.maid=maid;
                       postman.req.session.username=username;
                       postman.req.session.password=password;
                       postman.req.session.cookie.originalMaxAge = 1000*60*60*24*7;
                     }else{
                         postman.req.session.oid = oid;
                         postman.req.session.maid=maid;
                         postman.req.session.username= null;
                         postman.req.session.password= null;
                         postman.req.session.cookie.originalMaxAge = null
                     }
                     postman({success:true})
                 }else{
                     postman({success:false,message:err.msg})
                 }
             })
    }

}
export function getUser(postman){
    if(postman.req.session.username){
        postman({success:true,maid:postman.req.session.maid,username:postman.req.session.username,password:postman.req.session.password})
    }else{
        postman({success:false})
    }
}

</script>

// -----------------------------------------------------------------------------

<script client>

export function data (){
    return {
        //  //仅开发人员测试时使用
        //  maid:"8",
        //  username: "8",
        //  password: "888888"
        //集成时使用
         maid:'',
         username:'',
         password:''
    }
}

export function onsubmit(){
    console.log('------------------', JSON.stringify(csp))
    var self = this
    var remember = false
    remember =jQuery(".ui.log.checkbox").checkbox("is checked")


    login(this.maid,this.username, this.password,remember,function(err,data){
        if(data.success) {

            self.$dispatch("logined")

        }
        else {
            alert( data.message )
        }
    })
}

export function ready(){
    var self = this
    jQuery(".ui.log.checkbox").checkbox("set checked")
    getUser(function(err,data){
        if(data.success){
            self.maid = data.maid;
            self.username = data.username;
            self.password = data.password;
        }
    })


}



</script>
