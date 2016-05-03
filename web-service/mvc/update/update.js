var fileNames = new Array();
var curVersion = '';
var path = __dirname + "/sql/";
this.ready = function () {

  //判断读取哪个config文件
  if(typeof ison=="undefined") ison = {}
  try{
      ison.config = require("../../config.json");
  }catch(e) {
      if(e.code=="MODULE_NOT_FOUND") {
          ison.config = require("../../config.default.json");
      }
      else {
          console.error(e);
          process.exit();
      }
  }

  //连接数据库
  var mysql = require("mysql");
  ison.db = mysql.createConnection(ison.config.db);
  ison.db.connect();

  //获取当前版本号
  getCurVersion();

}

function updateDBAsync(pos, path) {
  if (pos < fileNames.length) {
    //生成sqls和tasks对象数组
    var sqls = '{';
    //var sqls = new Array();
    var tasks = new Array();
    for ( ; pos < fileNames.length; pos++) {
      var fileAbsPath = path + fileNames[pos];
      var sqlStr = readFile(fileAbsPath);
      if (sqlStr.length > 0) {
        for (var i = 0; i < sqlStr.length; i++) {
          var tempTaskStr = fileNames[pos] + i;
          var tempSqlStr = sqlStr[i];
          sqls += '"';
          sqls += tempTaskStr;
          sqls += '"';
          sqls += ':';
          sqls += '"';
          sqls += tempSqlStr;
          sqls += '"';
          sqls += ',';
          tasks.push(tempTaskStr);
        }
      }
    }
    if (sqls.length >= 2) {
      var tempStr = sqls.substring(0, sqls.length-1);
    }
    tempStr += '}';
    console.log("sqls: " + tempStr);
    var sqlsObj = JSON.parse(tempStr);

    //同步操作数据库
    var async = require('async');
    ison.db.beginTransaction(function(err) {
      if (err) {
        throw err;
      } else {
        async.eachSeries(tasks, function (item, callback) {
          //console.log(item + " ==> " + sqls[item]);
          ison.db.query(sqlsObj[item], function (err, res) {
            if (err) {
              console.log("update DB err at file :" + item);
              ison.db.rollback(function() {});
            }
            callback(err, res);
          });
        }, function (err) {
          if(err) {
          } else {
            ison.db.commit(function(err) {
              if (err) {
                return ison.db.rollback(function() {
                  throw err;
                });
              }
              if (fileNames.length > 0) {
                var newVersion = fileNames[fileNames.length - 1].split(".")[0];
                //console.log("newVersion: " + newVersion);
                var data = [ newVersion, 1 ];
                var sqlStr = "UPDATE tb_version SET version  = ? WHERE id = ?";
                ison.db.query(sqlStr, data, function(err, result) {
                  process.exit();
                });
              }
            });
          }
        });
      }
    });
  }
}

//读文件
function readFile(filename) {
  var sqlStr = new Array();
  var rf = require("fs");
  var data = rf.readFileSync(filename,"utf-8");
  sqlStr = data.split("\n");
  //console.log("sqlStr:" + sqlStr.length);
  return sqlStr;
}

function findPosInFileList(curVersion) {
  var pos = 0;
  if (curVersion.length > 0 && fileNames.length > 0) {
    if (curVersion == 'v0') {
       pos = 0;
    } else {
      var tempVer = curVersion + ".sql";
      for (var i = 0; i < fileNames.length; i++) {
        if (fileNames[i] == tempVer && i < fileNames.length) {
          pos = i + 1;
          break;
        }
      }
    }
  }
  //console.log("pos: " + pos);
  return pos;
}

function getCurVersion() {
  //读取当前版本号

  var sqlStr = "SELECT version FROM tb_version WHERE id=1 ";
  ison.db.query(sqlStr, function(err, result) {
    if (err) {
      //创建version表
      console.log("sel err : " + err);
      var createTbStr = "CREATE TABLE tb_version (id int(10) PRIMARY KEY, version varchar(20))";
      ison.db.query(createTbStr, function(err, result) {
        console.log("crt err: " + err);
        if (!err) {
          //插入一条记录
          var insertStr = "INSERT INTO tb_version VALUES (1, 'v0')";
          ison.db.query(insertStr, function(err, result) {
            curVersion = 'v0';
            //扫描指定文件夹
            scanSqlDir(path);

            //查找当前版本号在文件列表中的位置
            var pos = findPosInFileList(curVersion);

            //更新数据库
            updateDBAsync(pos, path);
          });
        }
      });
    } else {
      curVersion = result[0].version;
      //往下执行
      console.log("get db Version: " + curVersion);
      //扫描指定文件夹
      scanSqlDir(path);

      //查找当前版本号在文件列表中的位置
      var pos = findPosInFileList(curVersion);

      //更新数据库
      updateDBAsync(pos, path);
    }
  });
}

function scanSqlDir(path) {
  var fs = require('fs');
  fs.readdirSync(path).forEach(function (file) {
    if (fs.statSync(path + file).isFile()) {
      if (isStandardFormat(file)) {
        fileNames.push(file);
      }
    }
  });
  //console.log("fileNum: " + fileNames.length);
  //排序
  if (fileNames.length > 0) {
    for (var i = 0; i < fileNames.length; i++) {
      //解析文件名中的版本号，如v11.sql，则解析出11，并转换为数字
      var ordered = true;
		  for (var j = 0; j < fileNames.length - 1 - i; j++) {
        if (resolveFilename(fileNames[j + 1]) < resolveFilename(fileNames[j])) {
				  var temp = fileNames[j+1];
				  fileNames[j+1] = fileNames[j];
				  fileNames[j] = temp;
				  ordered = false;
			  }
      }
		  if (ordered)
			  break;
    }
  }
}

function fileNamesSortByAscend(fileNames) {
  if (fileNames.length > 0) {
    for (var i = 0; i < fileNames.length; i++) {
      //解析文件名中的版本号，如v11.sql，则解析出11，并转换为数字
      var ordered = true;
		  for (var j = 0; j < fileNames.length - 1 - i; j++) {
        if (resolveFilename(fileNames[j + 1]) < resolveFilename(fileNames[j])) {
				  var temp = fileNames[j+1];
				  fileNames[j+1] = fileNames[j];
				  fileNames[j] = temp;
				  ordered = false;
			  }
      }
		  if (ordered)
			  break;
    }
  }
}

function resolveFilename(filename) {
  if (filename.length >= 6 ) {
    var fileSuffix = filename.split(".");
    if (filename[0] == 'v' && fileSuffix.length == 2 && fileSuffix[1] == "sql") {
      if (fileSuffix[0].length > 1) {
        var versionStr = fileSuffix[0].substr(1);
        return Number(versionStr);
      }
    }
  }
}

function isStandardFormat(filename) {
  var rlt = false;
  if (filename.length >= 6) {
    var fileSuffix = filename.split(".");
    if (filename[0] == 'v' && fileSuffix.length == 2 && fileSuffix[1] == "sql") {
      var versionStr = fileSuffix[0].substr(1);
      var versionNum = Number(versionStr);
      if (versionNum > 0) {
        rlt = true;
      }
    }
  }
  return rlt;
}
