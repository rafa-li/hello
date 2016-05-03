/*
SQLyog Ultimate v11.24 (32 bit)
MySQL - 5.6.27-0ubuntu0.14.04.1 : Database - ison2b
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ison2b` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ison2b`;

/*Table structure for table `csp_asked_change_list` */

DROP TABLE IF EXISTS `csp_asked_change_list`;

CREATE TABLE `csp_asked_change_list` (
  `id` bigint(16) NOT NULL,
  `ask_trid` varchar(32) NOT NULL COMMENT '请求trid',
  `ask_tid` int(11) NOT NULL COMMENT '请求tid',
  `ask_code` varchar(6) NOT NULL COMMENT '请求code',
  `ask_cname` varchar(32) DEFAULT NULL,
  `ask_volume` int(32) DEFAULT NULL COMMENT '自己的数量',
  `ask_value` int(32) DEFAULT NULL COMMENT '自己的市值',
  `asked_trid` varchar(32) NOT NULL COMMENT '被请求trid',
  `asked_tid` int(11) NOT NULL COMMENT '被请求tid',
  `asked_code` varchar(6) NOT NULL COMMENT '被请求code',
  `asked_cname` varchar(32) DEFAULT NULL,
  `asked_volume` int(32) DEFAULT NULL COMMENT '被交换的数量',
  `asked_value` int(32) DEFAULT NULL COMMENT '被交换的市值',
  `stat` varchar(4) NOT NULL DEFAULT '0' COMMENT '状态,0，初始，1请求，2确认，3拒绝，4主动撤销，5被动撤销',
  `ask_time` varchar(32) NOT NULL DEFAULT '' COMMENT '请求时间,时间搓',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ask_time` (`ask_time`),
  KEY `stat` (`stat`),
  KEY `ask_tid` (`ask_tid`),
  KEY `ask_code` (`ask_code`),
  KEY `asked_tid` (`asked_tid`),
  KEY `asked_code` (`asked_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `csp_exchange_list` */

DROP TABLE IF EXISTS `csp_exchange_list`;

CREATE TABLE `csp_exchange_list` (
  `tid` int(11) NOT NULL,
  `cindex` varchar(32) DEFAULT NULL,
  `code` varchar(32) NOT NULL,
  `cname` varchar(32) DEFAULT NULL,
  `post_allocated_amount` varchar(32) DEFAULT '0',
  `post_exchange_amount` varchar(32) DEFAULT '0',
  `stat` tinyint(1) DEFAULT '0' COMMENT '0 默认，1 期望交换，2交换完成，3再次期望交换',
  `expect_exchange_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `exchange_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tid`,`code`),
  KEY `cindex` (`cindex`),
  KEY `stat` (`stat`),
  KEY `expect_exchange_time` (`expect_exchange_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
