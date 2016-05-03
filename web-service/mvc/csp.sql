/*
    csp v0.10 create by luchenqun 2016.03.15
*/

/*
-    表名：    csp_team_info
-    作者：    luchenqun
-    日期：    2016.03.15
-    版本：    v0.10
-    描述：    小组信息表格
*/
drop table if exists csp_team_info;
create table csp_team_info
(
   tid                  int(11) NOT NULL auto_increment,        -- 小组id, 自动增长
   tname                varchar(32) not null default 'na',      -- 小组名字
   trid                 varchar(32) not null,                   -- 小组所属的交易单元ID
   stat                 char(1) not null default '0',           --  小组状态,0表示正常
   primary key (tid)
);

/*
-    表名：    csp_team_info
-    作者：    luchenqun
-    日期：    2016.03.15
-    版本：    v0.10
-    描述：    小组成员信息表格
*/
drop table if exists csp_team_member;
create table csp_team_member
(
   traderid             varchar(32) not null,                   --  交易员登录ID(朱江华：一个交易员，只属于一个交易单元，只属于一个小组)
   trid                 varchar(32) not null,                   --  交易单元ID
   tid                  int(11) not null,                       --  小组id
   primary key (traderid)
);

/*
-    表名：    csp_trid_securities
-    作者：    lizhexi
-    日期：    2016.04.22
-    版本：    v0.10
-    描述：    交易单元券表表格
*/
drop table if exists csp_trid_securities;
create table csp_trid_securities
(
   code                 varchar(32) not null,                   --  证券代码，'000001'
   cname                varchar(32) not null,                   --  证券名称,'平安银行'
   amount               int         not null,                   --  数量,1000
   import_date          char(8)     not null,                   --  导入日期，'20160315'
   maid                 varchar(32) not null,                   --  资产管理人ID ，'1990'
   trid                 varchar(32) not null,                   --  交易单元ID， '1990.101.101'
   primary key (code,trid)
);

/*
-    表名：    csp_group_wish_list
-    作者：    wangxiong
-    日期：    2016.03.15
-    版本：    v0.10
-    描述：    小组心愿清单表表格
*/
-- drop table if exists csp_group_wish_list;
-- create table csp_group_wish_list
-- (
--    id                    int(10) PRIMARY KEY,           --  默认id 1
--    cindex                varchar(32),                   --  股票优先级,'1'
--    code                  varchar(32),                   --  证券代码，'000001'
--    cname                 varchar(32),                   --  证券名称,'平安银行'
--    amount                varchar(32),                   --  数量,1000
--    market_value          varchar(32),                   --  市值，1000
--    traderid              varchar(32),                   --  交易员登录ID(朱江华：一个交易员，只属于一个交易单元，只属于一个小组)
--    import_date           char(8)                        --  导入日期，'20160315'
-- );
/*
-    表名：    csp_group_wish_list
-    作者：    zhaofeng
-    日期：    2016.04.08
-    版本：    v0.20
-    描述：    小组心愿清单表表格
*/
-- drop table if exists csp_group_wish_list;
-- CREATE TABLE `csp_group_wish_list` (
--   `id` int(10) NOT NULL,                                    --  默认id 1
--   `tid` int(11) NOT NULL,                                   --  小组id,'1'
--   `cindex` varchar(32) NOT NULL,                            --  股票优先级,'1'
--   `code` varchar(32) NOT NULL,                              --  证券代码，'000001'
--   `cname` varchar(32) DEFAULT NULL,                         --  证券名称,'平安银行'
--   `amount` varchar(32) DEFAULT '0',                         --  心愿数量,1000
--   `market_value` varchar(32) DEFAULT '0',                   --  心愿市值,1000
--   `post_allocated_amount` varchar(32) DEFAULT '0',          --  分配后数量,1000
--   `post_allocated_value` varchar(32) DEFAULT '0',           --  分配后市值,1000
--   `post_exchange_amount` varchar(32) DEFAULT '0',           --  交换后数量,1000
--   `post_exchange_value` varchar(32) DEFAULT '0',            --  交换后市值,1000
--   `traderid` varchar(32) DEFAULT NULL,                      --  准备删掉
--   `expect_exchange` tinyint(1) DEFAULT '0',                 --  是否交换,1 交换，0不交换
--   `import_date` char(8) DEFAULT NULL,                       --  导入日期，'20160315'
--   PRIMARY KEY (`id`,`tid`,`cindex`,`code`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8

/*
-    表名：    csp_group_wish_list
-    作者：    lizhexi
-    日期：    2016.04.18
-    版本：    v0.20
-    描述：    小组心愿清单表表格
*/
drop table if exists csp_group_wish_list;
CREATE TABLE csp_group_wish_list (
  tid               int(11) NOT NULL,                           --  小组id,'1'
  cindex            varchar(32) NOT NULL,                       --  股票优先级,'1'
  code              varchar(32) NOT NULL,                       --  证券代码，'000001'
  cname             varchar(32) DEFAULT NULL,                   --  证券名称,'平安银行'
  amount            varchar(32) DEFAULT '0',                    --  心愿数量,1000
  maid              varchar(32) NOT NULL,                       --  资产管理人ID,'1990'
  trid              varchar(32) NOT NULL,                       --  交易单元ID,'1990.101.101'
  import_date       char(8) DEFAULT NULL,                       --  导入日期，'20160315'
  PRIMARY KEY (tid,code,trid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

/*
-    表名：    csp_random_allocated_results
-    作者：    ll
-    日期：    2016.04.14
-    版本：    v0.10
-    描述：    随机分券结果表格
*/
drop table if exists csp_random_allocated_results;
CREATE TABLE `csp_random_allocated_results` (
  `tid` int(11) NOT NULL,                                   --  小组id,'1'
  `cindex` varchar(32) NOT NULL,                            --  股票优先级,'1'
  `code` varchar(32) NOT NULL,                              --  证券代码，'000001'
  `cname` varchar(32) DEFAULT NULL,                         --  证券名称,'平安银行'
  `amount` varchar(32) DEFAULT '0',                         --  心愿数量,1000
  `market_value` varchar(32) DEFAULT '0',                   --  心愿市值,1000
  `post_allocated_amount` varchar(32) DEFAULT '0',          --  分配后数量,1000
  `post_allocated_value` varchar(32) DEFAULT '0',           --  分配后市值,1000
   trid                 varchar(32) not null,                   -- 小组所属的交易单元ID
  PRIMARY KEY (`tid`,`cindex`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
