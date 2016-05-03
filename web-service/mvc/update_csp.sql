/**
 *  数据库中csp相关表的更新  created by lizhexi 2016.04.22
 *
 */
/*
-    作者：     lizhexi
-    日期：     2016.04.22
-    操作对象： csp_trid_securities
-    描述：     券表添加trid字段并更改约束
*/
ALTER TABLE csp_trid_securities ADD trid VARCHAR(32)  NOT NULL;
ALTER TABLE csp_trid_securities DROP PRIMARY KEY;
ALTER TABLE csp_trid_securities ADD CONSTRAINT trid_sec PRIMARY KEY (code,trid);
/*
-    作者：     lizhexi
-    日期：     2016.04.25
-    操作对象： csp_trid_securities
-    描述：     小组心愿清单添加trid字段并更改约束
*/
ALTER TABLE csp_group_wish_list ADD trid VARCHAR(32)  NOT NULL;
ALTER TABLE csp_group_wish_list DROP PRIMARY KEY;
ALTER TABLE csp_group_wish_list ADD CONSTRAINT group_wish PRIMARY KEY (tid,code,trid);
